pragma ComponentBehavior: Bound

import QtQuick
import QtMultimedia
import Quickshell
import qs.components.effects
import qs.services
import qs.utils

Item {
    id: root

    property string path: ""
    property real speed: 1.0
    property bool playing: true
    property bool colourise: false
    property int fillMode: Image.PreserveAspectFit

    readonly property string resolvedPath: root.path ? Paths.absolutePath(root.path) : ""
    readonly property string lowerPath: root.resolvedPath.toLowerCase()
    readonly property bool isVideo: root.lowerPath !== "" && Images.isVideo(root.lowerPath)
    readonly property bool isAnimated: root.lowerPath !== "" && (Images.isAnimated(root.lowerPath) || root.lowerPath.endsWith(".webp"))
    readonly property real dpr: (QsWindow.window as QsWindow)?.devicePixelRatio ?? 1

    AnimatedImage {
        id: animatedImage

        anchors.fill: parent
        visible: !root.isVideo && root.isAnimated && root.resolvedPath !== ""
        source: visible ? root.resolvedPath : ""
        asynchronous: true
        playing: root.playing && visible
        speed: root.speed
        fillMode: root.fillMode
        sourceSize.width: Math.max(1, Math.round(width * root.dpr))
        layer.enabled: root.colourise && visible

        layer.effect: Colouriser {
            colorizationColor: Colours.palette.m3onSurface
            sourceColor: "white"
        }
    }

    Image {
        id: staticImage

        anchors.fill: parent
        visible: !root.isVideo && !root.isAnimated && root.resolvedPath !== ""
        source: visible ? root.resolvedPath : ""
        asynchronous: true
        fillMode: root.fillMode
        sourceSize: Qt.size(Math.max(1, Math.round(width * root.dpr)), Math.max(1, Math.round(height * root.dpr)))
        layer.enabled: root.colourise && visible

        layer.effect: Colouriser {
            colorizationColor: Colours.palette.m3onSurface
            sourceColor: "white"
        }
    }

    Loader {
        id: videoLoader

        anchors.fill: parent
        active: root.visible && root.playing && root.isVideo && root.resolvedPath !== ""
        visible: active

        sourceComponent: Item {
            MediaPlayer {
                id: mediaPlayer

                source: root.resolvedPath
                videoOutput: videoOutput
                loops: MediaPlayer.Infinite
                autoPlay: true
                playbackRate: root.speed
            }

            VideoOutput {
                id: videoOutput

                anchors.fill: parent
                fillMode: root.fillMode === Image.PreserveAspectCrop ? VideoOutput.PreserveAspectCrop : VideoOutput.PreserveAspectFit
            }
        }
    }
}
