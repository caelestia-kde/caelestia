#pragma once

#include <qelapsedtimer.h>
#include <qhash.h>
#include <qmutex.h>
#include <qobject.h>
#include <qset.h>
#include <qsize.h>
#include <qstring.h>

namespace caelestia::images {

class ImageCacher : public QObject {
    Q_OBJECT

public:
    enum class FillMode {
        Crop,
        Fit,
        Stretch,
    };

    struct SourceMetadata {
        QString key;
        qint64 size = 0;
        qint64 mtimeMs = 0;
        quint64 device = 0;
        quint64 inode = 0;
    };

    static ImageCacher* instance();

    static const QString& cacheDir();
    static QSize quantisedSize(const QSize& size);
    static QString cachePathFor(const QString& sourcePath, const QSize& size, FillMode fillMode);

    static void noteAccess(const QString& cachePath);
    static void pruneCache();

    void schedule(const QString& sourcePath, const QSize& size, FillMode fillMode);
    void schedule(const QString& sourcePath, const QString& cachePath, const QSize& size, FillMode fillMode);

    // The blocking form of the same job: builds the cache file if it is missing and
    // returns when it is there. An image provider request runs on its own thread and
    // cannot wait for a pooled task, so it calls this rather than scheduling one.
    static void runJob(const QString& sourcePath, const QString& cachePath, const QSize& size, FillMode fillMode);

private:
    explicit ImageCacher(QObject* parent = nullptr);

    QString metadataKeyFor(const QString& sourcePath);
    void noteWrite();
    void prune();
    void pruneLocked();

    QMutex m_mutex;
    QSet<QString> m_inflight;
    QHash<QString, SourceMetadata> m_metadata;
    QElapsedTimer m_sincePrune;
    int m_writesSincePrune = 0;
    bool m_pruning = false;
};

} // namespace caelestia::images
