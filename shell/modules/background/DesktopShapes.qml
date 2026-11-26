pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Quickshell
import Quickshell.Hyprland
import Caelestia.Config
import qs.components
import qs.services
import qs.modules.dashboard.dash as Dash
import "MusicScene.js" as MusicScene

Item {
    id: root

    property var frame: null
    property var controller: null
    readonly property bool immersiveMusic: Config.background.visualiser.enabled && Config.background.visualiser.immersiveMusic
        && MusicScene.usesBuiltIn(Config.background.visualiser.engine, Config.background.wallpaperEnabled, PlasmaWidgets.hasVisualizer, Config.background.disableQuickshellDesktop)
    readonly property bool circularBars: immersiveMusic
    readonly property bool musicParticles: immersiveMusic
    property ShellScreen screen: controller?.screenData ?? null
    property Item wallpaper: controller?.wallpaper ?? null
    property real absX: (controller?.gridOrigin.x ?? 0) + (frame?.x ?? 0)
    property real absY: (controller?.gridOrigin.y ?? 0) + (frame?.y ?? 0)

    property real shapesScale: frame ? Math.min(frame.width / 220, frame.height / 220) : 1
    readonly property bool autoHide: Config.background.desktopShapes.autoHide
    readonly property bool windowHidesShapes: Kwin.windowHidesDesktopWidgets(root.screen ? root.screen.name : "", false)
    readonly property bool shouldHide: autoHide && windowHidesShapes
    readonly property bool isPlaying: Players.active?.isPlaying ?? false


    implicitWidth: 220 * root.shapesScale
    implicitHeight: 220 * root.shapesScale
    width: frame ? frame.width : implicitWidth
    height: frame ? frame.height : implicitHeight

    opacity: (root.isPlaying && !root.shouldHide) ? 1 : 0
    visible: opacity > 0

    Behavior on opacity {
        Anim {
            type: Anim.SlowEffects
        }
    }

    Behavior on shapesScale {
        Anim {
            type: Anim.DefaultSpatial
        }
    }

    Behavior on implicitWidth {
        Anim {
            type: Anim.StandardSmall
        }
    }

    Behavior on implicitHeight {
        Anim {
            type: Anim.StandardSmall
        }
    }

    Dash.MediaShapes {
        id: shapes

        anchors.centerIn: parent
        width: Math.min(parent.width, parent.height) * (root.circularBars ? 0.70 : 0.92)
        height: width
        visible: root.visible && (!root.immersiveMusic || !root.windowHidesShapes)
        active: root.visible && root.isPlaying && (!root.immersiveMusic || !root.windowHidesShapes)
    }

    // All bars share a single update timer and the existing Cava subscription.
    Item {
        id: circularSpectrum

        readonly property real baseSize: Math.min(root.width, root.height)
        readonly property int barCount: 72
        property var displayed: []
        readonly property color spectrumColor: Qt.alpha(Colours.palette.m3primary, 0.9)

        function advance(): void {
            const values = Audio.cava?.values ?? [];
            const next = [];
            let changed = false;
            for (let i = 0; i < barCount; i++) {
                const value = values.length ? Math.max(0, Math.min(1, values[Math.floor(i * values.length / barCount)] ?? 0)) : 0;
                const target = Math.pow(value, 1.45);
                const old = displayed[i] ?? 0;
                const current = old + (target - old) * (target > old ? 0.7 : 0.32);
                next.push(current);
                if (Math.abs(current - old) > 0.001)
                    changed = true;
            }
            if (changed)
                displayed = next;
        }

        anchors.centerIn: parent
        width: baseSize
        height: width
        visible: root.circularBars && root.visible && !root.windowHidesShapes

        Repeater {
            model: circularSpectrum.visible ? circularSpectrum.barCount : 0

            delegate: Item {
                id: spoke

                required property int index

                anchors.fill: circularSpectrum
                rotation: index * 360 / circularSpectrum.barCount

                Rectangle {
                    width: Math.max(2, circularSpectrum.baseSize * 0.015)
                    height: Math.max(3, circularSpectrum.baseSize * (0.015 + (circularSpectrum.displayed[spoke.index] ?? 0) * 0.85))
                    radius: width / 2
                    x: (parent.width - width) / 2
                    // Maximum orb radius is 0.70 * 0.82 * 1.45 / 2 = 0.416.
                    y: parent.height / 2 - circularSpectrum.baseSize * 0.45 - height
                    color: circularSpectrum.spectrumColor
                }
            }
        }

        Timer {
            interval: 33
            repeat: true
            running: circularSpectrum.visible && root.isPlaying && Tokens.anim.enabled
            onTriggered: circularSpectrum.advance()
        }
    }

    Item {
        id: particles

        anchors.centerIn: parent
        width: Math.min(parent.width, parent.height)
        height: width
        visible: root.musicParticles && root.visible && !root.windowHidesShapes

        NumberAnimation on rotation {
            from: 0
            to: 360
            duration: 36000
            loops: Animation.Infinite
            running: particles.visible && root.isPlaying && Tokens.anim.enabled
        }

        Repeater {
            model: particles.visible ? 16 : 0

            delegate: Rectangle {
                required property int index
                readonly property var values: Audio.cava?.values ?? []
                readonly property real level: values.length > 0 ? Math.max(0, Math.min(1, values[Math.floor(index * values.length / 16)] ?? 0)) : 0
                readonly property real angle: index * 2.399963
                readonly property real distance: particles.width * (0.38 + (index % 3) * 0.035)

                width: Math.max(2, particles.width * (0.012 + level * 0.012))
                height: width
                radius: width / 2
                x: particles.width / 2 + Math.cos(angle) * distance - width / 2
                y: particles.height / 2 + Math.sin(angle) * distance - height / 2
                opacity: 0.25 + level * 0.6
                color: index % 2 ? Colours.palette.m3secondary : Colours.palette.m3primary

                Behavior on opacity {
                    NumberAnimation { duration: 180; easing.type: Easing.OutCubic }
                }
            }
        }
    }
}
