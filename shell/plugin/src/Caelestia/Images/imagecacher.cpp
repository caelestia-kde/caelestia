#include "imagecacher.hpp"

#include <qcryptographichash.h>
#include <qdatetime.h>
#include <qdir.h>
#include <qfile.h>
#include <qfiledevice.h>
#include <qfileinfo.h>
#include <qimage.h>
#include <qloggingcategory.h>
#include <qpainter.h>
#include <qsavefile.h>
#include <qstringlist.h>
#include <qthreadpool.h>

#include <algorithm>

#if defined(Q_OS_UNIX)
#include <sys/stat.h>
#endif

Q_LOGGING_CATEGORY(lcCacher, "caelestia.images.cacher", QtInfoMsg)

namespace caelestia::images {

namespace {

constexpr qint64 defaultCacheBudget = 192 * 1024 * 1024;
constexpr qint64 pruneIntervalMs = 5 * 60 * 1000;
constexpr qint64 minimumFileAgeMs = 60 * 1000;
constexpr int minCacheExtent = 32;

qint64 cacheBudget() {
    bool ok = false;
    const int megabytes = qEnvironmentVariableIntValue("CAELESTIA_IMAGE_CACHE_MB", &ok);
    if (!ok || megabytes <= 0)
        return defaultCacheBudget;

    return static_cast<qint64>(qBound(16, megabytes, 4096)) * 1024 * 1024;
}

int snapUp(int value) {
    if (value <= 0)
        return value;

    // Huge sources are still reasonable to cache, but a runaway requested size
    // should not be able to create a gigantic PNG.
    value = qMin(value, 4096);

    int step = 128;
    if (value <= 64)
        step = 8;
    else if (value <= 256)
        step = 16;
    else if (value <= 512)
        step = 32;
    else if (value <= 1024)
        step = 64;

    return ((value + step - 1) / step) * step;
}

QString hashMetadata(const QString& metadata) {
    return QString::fromLatin1(QCryptographicHash::hash(metadata.toUtf8(), QCryptographicHash::Sha256).toHex());
}

ImageCacher::SourceMetadata sourceMetadataFor(const QString& path) {
    const QFileInfo info(path);
    if (!info.exists() || !info.isFile())
        return {};

    ImageCacher::SourceMetadata metadata;
    metadata.size = info.size();
    metadata.mtimeMs = info.lastModified().toMSecsSinceEpoch();

#if defined(Q_OS_UNIX)
    struct stat statInfo{};
    if (::stat(QFile::encodeName(path).constData(), &statInfo) == 0) {
        metadata.device = static_cast<quint64>(statInfo.st_dev);
        metadata.inode = static_cast<quint64>(statInfo.st_ino);
    }
#endif

    const QString raw =
        QStringLiteral("%1|%2|%3|%4|%5")
            .arg(info.absoluteFilePath(), QString::number(metadata.size), QString::number(metadata.mtimeMs),
                QString::number(metadata.device), QString::number(metadata.inode));
    metadata.key = hashMetadata(raw);
    return metadata;
}

bool sameMetadata(const ImageCacher::SourceMetadata& lhs, const ImageCacher::SourceMetadata& rhs) {
    return lhs.size == rhs.size && lhs.mtimeMs == rhs.mtimeMs && lhs.device == rhs.device && lhs.inode == rhs.inode;
}

QString fillSuffix(ImageCacher::FillMode fillMode) {
    switch (fillMode) {
    case ImageCacher::FillMode::Crop:
        return QStringLiteral("crop");
    case ImageCacher::FillMode::Fit:
        return QStringLiteral("fit");
    default:
        return QStringLiteral("stretch");
    }
}

} // namespace

const QString& ImageCacher::cacheDir() {
    static const QString s_dir = [] {
        QString cache = qEnvironmentVariable("XDG_CACHE_HOME");
        if (cache.isEmpty())
            cache = QDir::homePath() + QStringLiteral("/.cache");
        return cache + QStringLiteral("/caelestia/imagecache");
    }();
    return s_dir;
}

QSize ImageCacher::quantisedSize(const QSize& size) {
    if (!size.isValid() || size.isEmpty())
        return size;

    return QSize(snapUp(size.width()), snapUp(size.height()));
}

QString ImageCacher::metadataKeyFor(const QString& sourcePath) {
    const auto metadata = sourceMetadataFor(sourcePath);
    if (metadata.key.isEmpty()) {
        QMutexLocker locker(&m_mutex);
        m_metadata.remove(sourcePath);
        return {};
    }

    QMutexLocker locker(&m_mutex);
    const auto it = m_metadata.constFind(sourcePath);
    if (it != m_metadata.cend() && sameMetadata(it.value(), metadata))
        return it.value().key;

    m_metadata.insert(sourcePath, metadata);
    return metadata.key;
}

QString ImageCacher::cachePathFor(const QString& sourcePath, const QSize& size, FillMode fillMode) {
    const QString key = instance()->metadataKeyFor(sourcePath);
    const QSize cacheSize = quantisedSize(size);
    if (key.isEmpty() || cacheSize.isEmpty() || cacheSize.width() < minCacheExtent ||
        cacheSize.height() < minCacheExtent)
        return {};

    const QString filename =
        QStringLiteral("v2-%1@%2x%3-%4.png")
            .arg(key, QString::number(cacheSize.width()), QString::number(cacheSize.height()), fillSuffix(fillMode));

    return cacheDir() + QLatin1Char('/') + filename;
}

ImageCacher* ImageCacher::instance() {
    static ImageCacher s_instance;
    return &s_instance;
}

ImageCacher::ImageCacher(QObject* parent)
    : QObject(parent) {
    prune();
}

void ImageCacher::noteAccess(const QString& cachePath) {
    if (cachePath.isEmpty())
        return;

    const QFileInfo info(cachePath);
    if (!info.exists())
        return;

    // Use file mtime as the LRU timestamp. Touching once a minute keeps pruning
    // accurate across restarts without writing metadata on every animation frame.
    if (info.lastModified().msecsTo(QDateTime::currentDateTime()) < minimumFileAgeMs)
        return;

    QFile file(cachePath);
    if (!file.open(QIODevice::ReadOnly))
        return;
    file.setFileTime(QDateTime::currentDateTime(), QFileDevice::FileModificationTime);
    file.close();
}

void ImageCacher::schedule(const QString& sourcePath, const QSize& size, FillMode fillMode) {
    schedule(sourcePath, cachePathFor(sourcePath, size, fillMode), size, fillMode);
}

void ImageCacher::schedule(const QString& sourcePath, const QString& cachePath, const QSize& size, FillMode fillMode) {
    if (cachePath.isEmpty())
        return;

    {
        QMutexLocker locker(&m_mutex);
        if (m_inflight.contains(cachePath))
            return;
        m_inflight.insert(cachePath);
    }

    QThreadPool::globalInstance()->start([this, sourcePath, cachePath, size, fillMode]() {
        runJob(sourcePath, cachePath, size, fillMode);
        QMutexLocker locker(&m_mutex);
        m_inflight.remove(cachePath);
    });
}

void ImageCacher::runJob(const QString& sourcePath, const QString& cachePath, const QSize& size, FillMode fillMode) {
    if (cachePath.isEmpty() || QFile::exists(cachePath)) {
        return;
    }

    QImage image(sourcePath);
    if (image.isNull()) {
        qCWarning(lcCacher).noquote() << "Failed to decode source" << sourcePath;
        return;
    }

    Qt::AspectRatioMode scaleMode = Qt::IgnoreAspectRatio;
    switch (fillMode) {
    case FillMode::Crop:
        scaleMode = Qt::KeepAspectRatioByExpanding;
        break;
    case FillMode::Fit:
        scaleMode = Qt::KeepAspectRatio;
        break;
    case FillMode::Stretch:
        scaleMode = Qt::IgnoreAspectRatio;
        break;
    }

    const QSize cacheSize = quantisedSize(size);
    image.convertTo(QImage::Format_ARGB32);
    image = image.scaled(cacheSize, scaleMode, Qt::SmoothTransformation);

    if (image.isNull()) {
        qCWarning(lcCacher).noquote() << "Failed to scale" << sourcePath;
        return;
    }

    QImage canvas;
    if (fillMode == FillMode::Stretch) {
        canvas = image;
    } else {
        canvas = QImage(cacheSize, QImage::Format_ARGB32);
        canvas.fill(Qt::transparent);

        QPainter painter(&canvas);
        painter.drawImage((cacheSize.width() - image.width()) / 2, (cacheSize.height() - image.height()) / 2, image);
        painter.end();
    }

    const QString parent = QFileInfo(cachePath).absolutePath();
    if (!QDir().mkpath(parent)) {
        qCWarning(lcCacher).noquote() << "Failed to create cache dir" << parent;
        return;
    }

    QSaveFile saveFile(cachePath);
    if (!saveFile.open(QIODevice::WriteOnly) || !canvas.save(&saveFile, "PNG") || !saveFile.commit()) {
        qCWarning(
            lcCacher, "Failed to save to %s: %s", qUtf8Printable(cachePath), qUtf8Printable(saveFile.errorString()));
        return;
    }

    instance()->noteWrite();
    qCDebug(lcCacher).noquote() << "Saved to" << cachePath;
}

void ImageCacher::noteWrite() {
    QMutexLocker locker(&m_mutex);
    ++m_writesSincePrune;
    if (m_writesSincePrune >= 64 || !m_sincePrune.isValid() || m_sincePrune.hasExpired(pruneIntervalMs))
        pruneLocked();
}

void ImageCacher::pruneCache() {
    instance()->prune();
}

void ImageCacher::prune() {
    QMutexLocker locker(&m_mutex);
    pruneLocked();
}

void ImageCacher::pruneLocked() {
    if (m_pruning)
        return;
    m_pruning = true;

    struct Entry {
        QString path;
        qint64 size = 0;
        qint64 mtimeMs = 0;
        bool eligible = false;
        bool obsolete = false;
    };

    const qint64 now = QDateTime::currentMSecsSinceEpoch();
    const QFileInfoList files = QDir(cacheDir()).entryInfoList(QStringList{ QStringLiteral("*.png") }, QDir::Files);
    QList<Entry> entries;
    entries.reserve(files.size());
    qint64 total = 0;

    for (const QFileInfo& info : files) {
        const QString path = info.absoluteFilePath();
        if (m_inflight.contains(path))
            continue;

        const qint64 size = info.size();
        const qint64 mtimeMs = info.lastModified().toMSecsSinceEpoch();
        const bool obsolete = !info.fileName().startsWith(QStringLiteral("v2-"));
        entries.append({ path, size, mtimeMs, obsolete || now - mtimeMs >= minimumFileAgeMs, obsolete });
        total += size;
    }

    std::sort(entries.begin(), entries.end(), [](const Entry& lhs, const Entry& rhs) {
        if (lhs.obsolete != rhs.obsolete)
            return lhs.obsolete > rhs.obsolete;
        return lhs.mtimeMs < rhs.mtimeMs;
    });

    const qint64 budget = cacheBudget();
    qint64 removedBytes = 0;
    int removedFiles = 0;
    if (total > budget) {
        for (const Entry& entry : entries) {
            if (!entry.obsolete && total <= budget)
                break;
            if (!entry.eligible)
                continue;
            if (!QFile::remove(entry.path))
                continue;

            total -= entry.size;
            removedBytes += entry.size;
            ++removedFiles;
        }
    }

    m_sincePrune.restart();
    m_writesSincePrune = 0;
    m_pruning = false;

    if (removedFiles > 0)
        qCInfo(lcCacher).noquote() << "Pruned" << removedFiles << "image cache files (" << removedBytes / 1024 / 1024
                                   << "MB)";
}

} // namespace caelestia::images
