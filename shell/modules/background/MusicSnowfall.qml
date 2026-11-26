pragma ComponentBehavior: Bound

import QtQuick
import Quickshell
import Caelestia.Config
import Caelestia.Services
import qs.services
import "MusicScene.js" as MusicScene

// A single shared animation moves all the particles. No capture or timer is
// running when the desktop is covered, the music is paused, or the setting is off.
Item {
    id: root

    required property ShellScreen screen

    readonly property bool enabledForScreen: MusicScene.hasMediaShape(DesktopLayout.widgets, DesktopLayout.positions, Screens.screens, root.screen?.name ?? "")
    readonly property bool running: enabledForScreen && (Players.active?.isPlaying ?? false)
        && !Audio.muted && Tokens.anim.enabled
        && !(GameMode.enabled && GlobalConfig.utilities.gameMode.disableVisualizer)
        && !Kwin.windowHidesDesktopWidgets(root.screen ? root.screen.name : "", false)
    readonly property var values: Audio.cava?.values ?? []
    readonly property real bass: values.length > 3 ? Math.min(1, Math.max(0, (values[0] + values[1] + values[2] + values[3]) / 4)) : 0
    property real phase: 0

    visible: running

    Loader {
        active: root.running
        sourceComponent: ServiceRef { service: Audio.cava }
    }

    NumberAnimation on phase {
        from: 0
        to: 1
        duration: 30000
        loops: Animation.Infinite
        running: root.running
    }

    Repeater {
        model: root.running ? 30 : 0

        delegate: Image {
            required property int index
            readonly property real xSeed: (index * 0.61803398875 + 0.09) % 1
            readonly property real ySeed: (index * 0.75487766625) % 1
            readonly property real travel: (root.phase * (index % 3 === 0 ? 2 : 1) + ySeed) % 1
            readonly property real pulse: root.bass * (0.45 + (index % 4) * 0.16)

            source: "snowflake-soft.png"
            width: 11 + (index % 3) * 1.2 + pulse * 2
            height: width
            smooth: true
            x: xSeed * root.width + Math.sin(root.phase * Math.PI * 2 + index * 2.4) * 10 - width / 2
            y: travel * (root.height + 24) - 12
            opacity: (0.7 + pulse * 0.25) * Math.min(1, travel * 10, (1 - travel) * 10)
        }
    }
}
