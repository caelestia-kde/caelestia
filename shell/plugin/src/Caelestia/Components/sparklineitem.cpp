#include "sparklineitem.hpp"

#include <qmatrix4x4.h>
#include <qsgflatcolormaterial.h>
#include <qsgnode.h>
#include <qsgvertexcolormaterial.h>

#include <algorithm>
#include <cmath>

#include "../circularbuffer.hpp"

namespace caelestia::components {

namespace {

constexpr int kCurveSubdivisions = 8;

struct SparklineSceneNodes {
    QSGClipNode* clip = nullptr;
    QSGTransformNode* transform = nullptr;
    QSGGeometryNode* fill1 = nullptr;
    QSGGeometryNode* stroke1 = nullptr;
    QSGGeometryNode* fill2 = nullptr;
    QSGGeometryNode* stroke2 = nullptr;
};

QSGGeometryNode* createFillNode() {
    auto* node = new QSGGeometryNode();
    auto* geom = new QSGGeometry(QSGGeometry::defaultAttributes_Point2D(), 0);
    geom->setDrawingMode(QSGGeometry::DrawTriangleStrip);
    node->setGeometry(geom);
    node->setFlag(QSGNode::OwnsGeometry);

    auto* mat = new QSGFlatColorMaterial();
    mat->setFlag(QSGMaterial::Blending, true);
    node->setMaterial(mat);
    node->setFlag(QSGNode::OwnsMaterial);
    return node;
}

QSGGeometryNode* createStrokeNode() {
    auto* node = new QSGGeometryNode();
    auto* geom = new QSGGeometry(QSGGeometry::defaultAttributes_ColoredPoint2D(), 0, 0, QSGGeometry::UnsignedIntType);
    geom->setDrawingMode(QSGGeometry::DrawTriangles);
    node->setGeometry(geom);
    node->setFlag(QSGNode::OwnsGeometry);

    auto* mat = new QSGVertexColorMaterial();
    mat->setFlag(QSGMaterial::Blending, true);
    node->setMaterial(mat);
    node->setFlag(QSGNode::OwnsMaterial);
    return node;
}

void clearGeometry(QSGGeometryNode* node) {
    auto* geom = node->geometry();
    if (geom->vertexCount() != 0 || geom->indexCount() != 0) {
        geom->allocate(0, 0);
        node->markDirty(QSGNode::DirtyGeometry);
    }
}

void updateFillColor(QSGGeometryNode* node, const QColor& baseColor, qreal alpha) {
    QColor fillColor = baseColor;
    fillColor.setAlphaF(static_cast<float>(std::clamp(alpha, 0.0, 1.0)));
    auto* mat = static_cast<QSGFlatColorMaterial*>(node->material());
    if (mat->color() != fillColor) {
        mat->setColor(fillColor);
        node->markDirty(QSGNode::DirtyMaterial);
    }
}

qreal harmonicTangent(qreal prevDelta, qreal nextDelta) {
    if (prevDelta * nextDelta <= 0.0) {
        return 0.0;
    }
    return (2.0 * prevDelta * nextDelta) / (prevDelta + nextDelta);
}

} // namespace

SparklineItem::SparklineItem(QQuickItem* parent)
    : QQuickItem(parent) {
    setFlag(ItemHasContents, true);
}

QSGNode* SparklineItem::updatePaintNode(QSGNode* oldNode, UpdatePaintNodeData*) {
    const qreal w = width();
    const qreal h = height();
    const bool has1 = m_line1 && m_line1->count() >= 2;
    const bool has2 = m_line2 && m_line2->count() >= 2;

    if ((!has1 && !has2) || w <= 0.0 || h <= 0.0 || m_historyLength < 2) {
        delete oldNode;
        m_geometryDirty = true;
        m_materialDirty = true;
        m_transformDirty = true;
        return nullptr;
    }

    auto* clipNode = static_cast<QSGClipNode*>(oldNode);
    SparklineSceneNodes nodes;

    if (!clipNode) {
        clipNode = new QSGClipNode();
        clipNode->setIsRectangular(true);

        nodes.transform = new QSGTransformNode();
        nodes.fill1 = createFillNode();
        nodes.stroke1 = createStrokeNode();
        nodes.fill2 = createFillNode();
        nodes.stroke2 = createStrokeNode();

        nodes.transform->appendChildNode(nodes.fill1);
        nodes.transform->appendChildNode(nodes.stroke1);
        nodes.transform->appendChildNode(nodes.fill2);
        nodes.transform->appendChildNode(nodes.stroke2);
        clipNode->appendChildNode(nodes.transform);

        m_geometryDirty = true;
        m_materialDirty = true;
        m_transformDirty = true;
    } else {
        nodes.clip = clipNode;
        nodes.transform = static_cast<QSGTransformNode*>(clipNode->firstChild());
        auto* child = nodes.transform->firstChild();
        nodes.fill1 = static_cast<QSGGeometryNode*>(child);
        nodes.stroke1 = static_cast<QSGGeometryNode*>(nodes.fill1->nextSibling());
        nodes.fill2 = static_cast<QSGGeometryNode*>(nodes.stroke1->nextSibling());
        nodes.stroke2 = static_cast<QSGGeometryNode*>(nodes.fill2->nextSibling());
    }

    const QRectF clipRect(0.0, 0.0, w, h);
    if (clipNode->clipRect() != clipRect) {
        clipNode->setClipRect(clipRect);
    }

    if (m_materialDirty) {
        updateFillColor(nodes.fill1, m_line1Color, m_line1FillAlpha);
        updateFillColor(nodes.fill2, m_line2Color, m_line2FillAlpha);
        m_materialDirty = false;
    }

    if (m_geometryDirty) {
        if (has1) {
            buildLineGeometry(m_line1, m_line1Color, nodes.fill1->geometry(), nodes.stroke1->geometry());
            nodes.fill1->markDirty(QSGNode::DirtyGeometry);
            nodes.stroke1->markDirty(QSGNode::DirtyGeometry);
        } else {
            clearGeometry(nodes.fill1);
            clearGeometry(nodes.stroke1);
        }

        if (has2) {
            buildLineGeometry(m_line2, m_line2Color, nodes.fill2->geometry(), nodes.stroke2->geometry());
            nodes.fill2->markDirty(QSGNode::DirtyGeometry);
            nodes.stroke2->markDirty(QSGNode::DirtyGeometry);
        } else {
            clearGeometry(nodes.fill2);
            clearGeometry(nodes.stroke2);
        }

        m_geometryDirty = false;
    }

    if (m_transformDirty) {
        const qreal stepX = w / static_cast<qreal>(m_historyLength - 1);
        QMatrix4x4 matrix;
        matrix.translate(static_cast<float>(-stepX * m_slideProgress), 0.0f);
        nodes.transform->setMatrix(matrix);
        m_transformDirty = false;
    }

    return clipNode;
}

void SparklineItem::buildLineGeometry(
    CircularBuffer* buffer, const QColor& color, QSGGeometry* fillGeom, QSGGeometry* strokeGeom) {
    const qreal w = width();
    const qreal h = height();
    const int len = buffer->count();
    const qreal stepX = w / static_cast<qreal>(m_historyLength - 1);
    const qreal baseStartX = w - static_cast<qreal>(len - 2) * stepX;

    const qreal pad = m_lineWidth * 0.5;
    const qreal usableH = std::max<qreal>(1.0, h - m_lineWidth);
    const qreal safeMax = m_maxValue > 0.0 ? m_maxValue : 1.0;

    m_samplePoints.resize(static_cast<size_t>(len));
    for (int i = 0; i < len; ++i) {
        const qreal x = baseStartX + static_cast<qreal>(i) * stepX;
        const qreal y = pad + usableH - (buffer->at(i) / safeMax) * usableH;
        m_samplePoints[static_cast<size_t>(i)] = QPointF(x, y);
    }

    if (m_smooth && len >= 3) {
        const int totalPoints = (len - 1) * kCurveSubdivisions + 1;
        m_curvePoints.resize(static_cast<size_t>(totalPoints));
        m_curvePoints[0] = m_samplePoints[0];

        size_t outIdx = 1;
        qreal prevDelta = m_samplePoints[1].y() - m_samplePoints[0].y();
        qreal t0 = prevDelta;

        for (int i = 0; i < len - 1; ++i) {
            const QPointF& p0 = m_samplePoints[static_cast<size_t>(i)];
            const QPointF& p1 = m_samplePoints[static_cast<size_t>(i + 1)];
            const qreal currDelta = p1.y() - p0.y();

            qreal t1 = currDelta;
            if (i + 2 < len) {
                const qreal nextDelta = m_samplePoints[static_cast<size_t>(i + 2)].y() - p1.y();
                t1 = harmonicTangent(currDelta, nextDelta);
            }

            const qreal cp1x = p0.x() + stepX / 3.0;
            const qreal cp1y = p0.y() + t0 / 3.0;
            const qreal cp2x = p1.x() - stepX / 3.0;
            const qreal cp2y = p1.y() - t1 / 3.0;

            for (int s = 1; s <= kCurveSubdivisions; ++s) {
                const qreal u = static_cast<qreal>(s) / static_cast<qreal>(kCurveSubdivisions);
                const qreal inv = 1.0 - u;
                const qreal b0 = inv * inv * inv;
                const qreal b1 = 3.0 * inv * inv * u;
                const qreal b2 = 3.0 * inv * u * u;
                const qreal b3 = u * u * u;
                m_curvePoints[outIdx++] = QPointF(b0 * p0.x() + b1 * cp1x + b2 * cp2x + b3 * p1.x(),
                    b0 * p0.y() + b1 * cp1y + b2 * cp2y + b3 * p1.y());
            }

            t0 = t1;
        }
    } else {
        m_curvePoints.assign(m_samplePoints.begin(), m_samplePoints.end());
    }

    const int count = static_cast<int>(m_curvePoints.size());
    if (count < 2) {
        fillGeom->allocate(0);
        strokeGeom->allocate(0, 0);
        return;
    }

    fillGeom->allocate(count * 2);
    auto* fillVerts = fillGeom->vertexDataAsPoint2D();
    const float bottomY = static_cast<float>(h);
    for (int i = 0; i < count; ++i) {
        const auto fx = static_cast<float>(m_curvePoints[static_cast<size_t>(i)].x());
        const auto fy = static_cast<float>(m_curvePoints[static_cast<size_t>(i)].y());
        fillVerts[i * 2].set(fx, fy);
        fillVerts[i * 2 + 1].set(fx, bottomY);
    }

    const qreal halfCore = std::max<qreal>(0.0, m_lineWidth * 0.5 - 0.5);
    const qreal halfOuter = m_lineWidth * 0.5 + 0.75;

    const auto alphaF = static_cast<qreal>(color.alphaF());
    const auto r = static_cast<unsigned char>(std::lround(color.red() * alphaF));
    const auto g = static_cast<unsigned char>(std::lround(color.green() * alphaF));
    const auto b = static_cast<unsigned char>(std::lround(color.blue() * alphaF));
    const auto a = static_cast<unsigned char>(color.alpha());

    strokeGeom->allocate(count * 4, (count - 1) * 18);
    auto* verts = strokeGeom->vertexDataAsColoredPoint2D();
    auto* indices = strokeGeom->indexDataAsUInt();

    for (int i = 0; i < count; ++i) {
        QPointF tangent;
        if (i == 0) {
            tangent = m_curvePoints[1] - m_curvePoints[0];
        } else if (i == count - 1) {
            tangent = m_curvePoints[static_cast<size_t>(count - 1)] - m_curvePoints[static_cast<size_t>(count - 2)];
        } else {
            tangent = m_curvePoints[static_cast<size_t>(i + 1)] - m_curvePoints[static_cast<size_t>(i - 1)];
        }

        const qreal tLen = std::hypot(tangent.x(), tangent.y());
        qreal nx = 0.0;
        qreal ny = -1.0;
        if (tLen > 1e-6) {
            nx = -tangent.y() / tLen;
            ny = tangent.x() / tLen;
        }

        const QPointF& pt = m_curvePoints[static_cast<size_t>(i)];
        const int base = i * 4;
        verts[base + 0].set(
            static_cast<float>(pt.x() - nx * halfOuter), static_cast<float>(pt.y() - ny * halfOuter), 0, 0, 0, 0);
        verts[base + 1].set(
            static_cast<float>(pt.x() - nx * halfCore), static_cast<float>(pt.y() - ny * halfCore), r, g, b, a);
        verts[base + 2].set(
            static_cast<float>(pt.x() + nx * halfCore), static_cast<float>(pt.y() + ny * halfCore), r, g, b, a);
        verts[base + 3].set(
            static_cast<float>(pt.x() + nx * halfOuter), static_cast<float>(pt.y() + ny * halfOuter), 0, 0, 0, 0);
    }

    int idx = 0;
    for (int i = 0; i < count - 1; ++i) {
        const quint32 c0 = static_cast<quint32>(i * 4);
        const quint32 c1 = static_cast<quint32>((i + 1) * 4);
        for (quint32 band = 0; band < 3; ++band) {
            const quint32 a0 = c0 + band;
            const quint32 a1 = c0 + band + 1;
            const quint32 b0 = c1 + band;
            const quint32 b1 = c1 + band + 1;
            indices[idx++] = a0;
            indices[idx++] = a1;
            indices[idx++] = b1;
            indices[idx++] = a0;
            indices[idx++] = b1;
            indices[idx++] = b0;
        }
    }
}

void SparklineItem::geometryChange(const QRectF& newGeometry, const QRectF& oldGeometry) {
    QQuickItem::geometryChange(newGeometry, oldGeometry);
    if (newGeometry.size() != oldGeometry.size()) {
        scheduleGeometryUpdate();
    }
}

void SparklineItem::connectBuffer(CircularBuffer* buffer) {
    if (!buffer) {
        return;
    }

    connect(buffer, &CircularBuffer::valuesChanged, this, [this]() {
        scheduleGeometryUpdate();
    });
    connect(buffer, &QObject::destroyed, this, [this, buffer]() {
        if (m_line1 == buffer) {
            m_line1 = nullptr;
            emit line1Changed();
        }
        if (m_line2 == buffer) {
            m_line2 = nullptr;
            emit line2Changed();
        }
        scheduleGeometryUpdate();
    });
}

void SparklineItem::scheduleGeometryUpdate() {
    m_geometryDirty = true;
    m_transformDirty = true;
    update();
}

CircularBuffer* SparklineItem::line1() const {
    return m_line1;
}

void SparklineItem::setLine1(CircularBuffer* buffer) {
    if (m_line1 == buffer) {
        return;
    }
    if (m_line1) {
        disconnect(m_line1, nullptr, this, nullptr);
    }
    m_line1 = buffer;
    connectBuffer(buffer);
    emit line1Changed();
    scheduleGeometryUpdate();
}

CircularBuffer* SparklineItem::line2() const {
    return m_line2;
}

void SparklineItem::setLine2(CircularBuffer* buffer) {
    if (m_line2 == buffer) {
        return;
    }
    if (m_line2) {
        disconnect(m_line2, nullptr, this, nullptr);
    }
    m_line2 = buffer;
    connectBuffer(buffer);
    emit line2Changed();
    scheduleGeometryUpdate();
}

QColor SparklineItem::line1Color() const {
    return m_line1Color;
}

void SparklineItem::setLine1Color(const QColor& color) {
    if (m_line1Color == color) {
        return;
    }
    m_line1Color = color;
    m_materialDirty = true;
    m_geometryDirty = true;
    emit line1ColorChanged();
    update();
}

QColor SparklineItem::line2Color() const {
    return m_line2Color;
}

void SparklineItem::setLine2Color(const QColor& color) {
    if (m_line2Color == color) {
        return;
    }
    m_line2Color = color;
    m_materialDirty = true;
    m_geometryDirty = true;
    emit line2ColorChanged();
    update();
}

qreal SparklineItem::line1FillAlpha() const {
    return m_line1FillAlpha;
}

void SparklineItem::setLine1FillAlpha(qreal alpha) {
    if (qFuzzyCompare(m_line1FillAlpha, alpha)) {
        return;
    }
    m_line1FillAlpha = alpha;
    m_materialDirty = true;
    emit line1FillAlphaChanged();
    update();
}

qreal SparklineItem::line2FillAlpha() const {
    return m_line2FillAlpha;
}

void SparklineItem::setLine2FillAlpha(qreal alpha) {
    if (qFuzzyCompare(m_line2FillAlpha, alpha)) {
        return;
    }
    m_line2FillAlpha = alpha;
    m_materialDirty = true;
    emit line2FillAlphaChanged();
    update();
}

qreal SparklineItem::maxValue() const {
    return m_maxValue;
}

void SparklineItem::setMaxValue(qreal value) {
    if (qFuzzyCompare(m_maxValue, value)) {
        return;
    }
    m_maxValue = value;
    emit maxValueChanged();
    scheduleGeometryUpdate();
}

qreal SparklineItem::slideProgress() const {
    return m_slideProgress;
}

void SparklineItem::setSlideProgress(qreal progress) {
    if (qFuzzyCompare(m_slideProgress, progress)) {
        return;
    }
    m_slideProgress = progress;
    m_transformDirty = true;
    emit slideProgressChanged();
    update();
}

int SparklineItem::historyLength() const {
    return m_historyLength;
}

void SparklineItem::setHistoryLength(int length) {
    if (m_historyLength == length) {
        return;
    }
    m_historyLength = length;
    emit historyLengthChanged();
    scheduleGeometryUpdate();
}

qreal SparklineItem::lineWidth() const {
    return m_lineWidth;
}

void SparklineItem::setLineWidth(qreal width) {
    if (qFuzzyCompare(m_lineWidth, width)) {
        return;
    }
    m_lineWidth = width;
    emit lineWidthChanged();
    scheduleGeometryUpdate();
}

bool SparklineItem::smooth() const {
    return m_smooth;
}

void SparklineItem::setSmooth(bool smooth) {
    if (m_smooth == smooth) {
        return;
    }
    m_smooth = smooth;
    emit smoothChanged();
    scheduleGeometryUpdate();
}

} // namespace caelestia::components
