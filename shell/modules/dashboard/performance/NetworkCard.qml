pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Caelestia.Components
import Caelestia.Config
import Caelestia.Services
import qs.components
import qs.services

StyledRect {
    id: root

    property real cardWidth: Tokens.sizes.dashboard.perfNetworkCardWidth

    color: Colours.tPalette.m3surfaceContainer
    radius: Tokens.rounding.extraLarge

    implicitWidth: root.cardWidth
    implicitHeight: Tokens.sizes.dashboard.perfNetworkCardHeight

    ServiceRef {
        service: NetworkUsage
    }

    ColumnLayout {
        id: layout

        anchors.fill: parent
        anchors.margins: Tokens.padding.large
        anchors.bottomMargin: Tokens.padding.medium
        spacing: 0

        RowLayout {
            spacing: Tokens.spacing.small

            MaterialIcon {
                text: "swap_vert"
                color: Colours.palette.m3primary
                fontStyle: Tokens.font.icon.medium
            }

            StyledText {
                text: qsTr("Network")
                font: Tokens.font.title.medium
            }
        }

        Item {
            Layout.topMargin: Tokens.spacing.medium
            Layout.bottomMargin: Tokens.spacing.small
            Layout.fillWidth: true
            Layout.fillHeight: true

            SparklineItem {
                id: sparkline

                property real targetMax: Math.max(NetworkUsage.downloadBuffer.maximum, NetworkUsage.uploadBuffer.maximum, 1024)
                property real smoothMax: targetMax
                property real phaseError: 0

                anchors.fill: parent
                line1: NetworkUsage.uploadBuffer // qmllint disable missing-type
                line1Color: Colours.palette.m3secondary
                line1FillAlpha: 0.15
                line2: NetworkUsage.downloadBuffer // qmllint disable missing-type
                line2Color: Colours.palette.m3tertiary
                line2FillAlpha: 0.2
                maxValue: smoothMax
                historyLength: NetworkUsage.historyLength
                slideProgress: NetworkUsage.downloadBuffer.count >= 4 ? 0.25 : 0.0

                onVisibleChanged: {
                    if (visible) {
                        targetMax = Math.max(NetworkUsage.downloadBuffer.maximum, NetworkUsage.uploadBuffer.maximum, 1024);
                        phaseError = 0;
                        slideProgress = NetworkUsage.downloadBuffer.count >= 4 ? 0.25 : 0.0;
                    }
                }

                Connections {
                    function onSamplesUpdated(): void {
                        sparkline.targetMax = Math.max(NetworkUsage.downloadBuffer.maximum, NetworkUsage.uploadBuffer.maximum, 1024);

                        const count = NetworkUsage.downloadBuffer.count;
                        if (!sparkline.visible || count < 2) {
                            sparkline.phaseError = 0;
                            sparkline.slideProgress = count >= 4 ? 0.25 : 0.0;
                            return;
                        }

                        if (count === 2) {
                            sparkline.phaseError = 0;
                            sparkline.slideProgress = 0.0;
                            return;
                        }

                        // Shift slideProgress by -1.0 when a new sample enters so every point keeps its exact screen X.
                        const shifted = sparkline.slideProgress - 1.0;
                        const targetPostTick = count >= 4 ? -0.25 : 0.0;
                        sparkline.slideProgress = shifted;
                        sparkline.phaseError = Math.max(-1.0, Math.min(1.0, targetPostTick - shifted));
                    }

                    target: NetworkUsage
                }

                FrameAnimation {
                    running: sparkline.visible && NetworkUsage.downloadBuffer.count >= 2
                    onTriggered: {
                        const dt = Math.min(frameTime, 0.1);
                        const intervalSec = Math.max(GlobalConfig.dashboard.resourceUpdateInterval, 100) / 1000.0;
                        const correction = Math.max(0.75, Math.min(1.35, 1.0 + sparkline.phaseError * 0.6));
                        const step = (dt / intervalSec) * correction;

                        sparkline.phaseError *= Math.exp(-dt / intervalSec);
                        const next = sparkline.slideProgress + step;
                        sparkline.slideProgress = next > 0.85 ? 0.85 + 0.15 * (1.0 - Math.exp(-(next - 0.85) / 0.15)) : next;
                    }
                }

                Behavior on smoothMax {
                    Anim {}
                }
            }

            StyledText {
                anchors.centerIn: parent
                text: qsTr("Collecting data...")
                font: Tokens.font.body.small
                color: Colours.palette.m3outline
                visible: NetworkUsage.downloadBuffer.count < 2
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: Tokens.spacing.small

            MaterialIcon {
                text: "download"
                color: Colours.palette.m3tertiary
                fontStyle: Tokens.font.icon.medium
            }

            StyledText {
                text: qsTr("Download")
                font: Tokens.font.body.small
                color: Colours.palette.m3onSurfaceVariant
            }

            Item {
                Layout.fillWidth: true
            }

            StyledText {
                text: Units.formatBytes(NetworkUsage.downloadSpeed ?? 0, true)
                font: Tokens.font.body.builders.medium.weight(Font.Medium).build()
                color: Colours.palette.m3tertiary
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: Tokens.spacing.small

            MaterialIcon {
                text: "upload"
                color: Colours.palette.m3secondary
                fontStyle: Tokens.font.icon.medium
            }

            StyledText {
                text: qsTr("Upload")
                font: Tokens.font.body.small
                color: Colours.palette.m3onSurfaceVariant
            }

            Item {
                Layout.fillWidth: true
            }

            StyledText {
                text: Units.formatBytes(NetworkUsage.uploadSpeed ?? 0, true)
                font: Tokens.font.body.builders.medium.weight(Font.Medium).build()
                color: Colours.palette.m3secondary
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: Tokens.spacing.small

            MaterialIcon {
                text: "history"
                color: Colours.palette.m3onSurfaceVariant
                fontStyle: Tokens.font.icon.medium
            }

            StyledText {
                text: qsTr("Total")
                font: Tokens.font.body.small
                color: Colours.palette.m3onSurfaceVariant
            }

            Item {
                Layout.fillWidth: true
            }

            StyledText {
                text: `↓${Units.formatBytes(NetworkUsage.downloadTotal ?? 0)} ↑${Units.formatBytes(NetworkUsage.uploadTotal ?? 0)}`
                font: Tokens.font.body.small
                color: Colours.palette.m3onSurfaceVariant
            }
        }
    }
}
