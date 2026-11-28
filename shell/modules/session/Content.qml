pragma ComponentBehavior: Bound

import QtQuick
import Quickshell
import Caelestia
import Caelestia.Config
import Caelestia.Services
import qs.components
import qs.components.controls
import qs.components.images
import qs.services
import qs.utils

Column {
    id: root

    required property DrawerVisibilities visibilities

    readonly property var predefinedIds: ["logout", "reboot", "shutdown", "sleep", "hibernate", "lock", "changeUser"]
    readonly property var defaultLabels: ({
        logout: qsTr("Log out"),
        shutdown: qsTr("Shut down"),
        sleep: qsTr("Sleep"),
        hibernate: qsTr("Hibernate"),
        reboot: qsTr("Restart"),
        lock: qsTr("Lock"),
        changeUser: qsTr("Switch user")
    })

    // Localised labels vary a lot in width ("Log out" vs "Перезагрузка"), so the
    // buttons share the width of the longest one instead of a fixed square.
    readonly property real buttonWidth: {
        let maxW = Tokens.sizes.session.button;
        for (let i = 0; i < entriesRepeater.count; i++) {
            const item = entriesRepeater.itemAt(i) as EntryDelegate;
            if (item && !item.isMedia)
                maxW = Math.max(maxW, item.buttonPreferredWidth);
        }
        return maxW;
    }

    function resolvedLabel(entry: var): string {
        if (!entry)
            return "";
        if (entry.label && entry.label.length > 0)
            return entry.label;
        return root.defaultLabels[entry.id] ?? "";
    }

    function resolvedIcon(entry: var): string {
        if (!entry)
            return "help_outline";
        if (entry.icon && entry.icon.length > 0)
            return entry.icon;
        if (entry.id && root.predefinedIds.includes(entry.id))
            return Config.session.icons[entry.id] || "help_outline";
        return "help_outline";
    }

    function resolvedCommand(entry: var): var {
        if (!entry)
            return [];
        if (entry.id && root.predefinedIds.includes(entry.id))
            return Config.session.commands[entry.id] ?? [];
        return entry.command ?? [];
    }

    function resolvedMedia(entry: var): string {
        if (!entry)
            return "";
        if (entry.media && entry.media.length > 0)
            return entry.media;
        if (entry.id === "gif")
            return Config.paths.sessionGif;
        return "";
    }

    function firstButtonItem(): Item {
        for (let i = 0; i < entriesRepeater.count; i++) {
            const item = entriesRepeater.itemAt(i) as EntryDelegate;
            if (item && !item.isMedia && item.buttonItem)
                return item.buttonItem;
        }
        return null;
    }

    function adjacentButtonItem(fromIndex: int, step: int): Item {
        for (let i = fromIndex + step; i >= 0 && i < entriesRepeater.count; i += step) {
            const item = entriesRepeater.itemAt(i) as EntryDelegate;
            if (item && !item.isMedia && item.buttonItem)
                return item.buttonItem;
        }
        return null;
    }

    function focusFirstButton(): void {
        Qt.callLater(() => {
            const first = root.firstButtonItem();
            if (first)
                first.forceActiveFocus();
        });
    }

    padding: Tokens.padding.large
    rightPadding: CUtils.clamp(padding - Config.border.thickness, 0, padding)
    spacing: Tokens.spacing.large

    Component.onCompleted: focusFirstButton()

    Connections {
        function onLauncherChanged(): void {
            if (!root.visibilities.launcher)
                root.focusFirstButton();
        }

        target: root.visibilities
    }

    Repeater {
        id: entriesRepeater

        model: Config.session.entries.values

        delegate: EntryDelegate {}
    }

    component EntryDelegate: Item {
        id: entryDelegate

        required property var modelData
        required property int index

        readonly property bool isMedia: modelData?.type === "media"
        readonly property Item buttonItem: entryLoader.status === Loader.Ready && !isMedia ? entryLoader.item : null
        readonly property real buttonPreferredWidth: (buttonItem as SessionButton)?.preferredWidth ?? 0

        width: root.buttonWidth
        height: entryLoader.status === Loader.Ready && entryLoader.item ? entryLoader.item.implicitHeight : Tokens.sizes.session.button

        Loader {
            id: entryLoader

            anchors.fill: parent
            sourceComponent: entryDelegate.isMedia ? mediaComponent : buttonComponent

            onLoaded: {
                if (entryDelegate.index === 0 || entryDelegate.buttonItem === root.firstButtonItem())
                    root.focusFirstButton();
            }
        }

        Component {
            id: buttonComponent

            SessionButton {
                label: root.resolvedLabel(entryDelegate.modelData)
                icon: root.resolvedIcon(entryDelegate.modelData)
                command: root.resolvedCommand(entryDelegate.modelData)

                KeyNavigation.up: root.adjacentButtonItem(entryDelegate.index, -1)
                KeyNavigation.down: root.adjacentButtonItem(entryDelegate.index, 1)
            }
        }

        Component {
            id: mediaComponent

            Item {
                readonly property bool useDino: GlobalConfig.general.caelestiaMode && entryDelegate.modelData?.id === "gif" && !(entryDelegate.modelData?.media)
                readonly property string mediaSource: useDino ? "root:/assets/dino.gif" : root.resolvedMedia(entryDelegate.modelData)

                implicitWidth: root.buttonWidth
                implicitHeight: Tokens.sizes.session.button

                MediaView {
                    anchors.centerIn: parent
                    width: Tokens.sizes.session.button
                    height: Tokens.sizes.session.button
                    path: parent.mediaSource
                    speed: Config.general.sessionGifSpeed
                    playing: root.visible && visible
                    colourise: parent.useDino
                    visible: parent.mediaSource !== ""
                }
            }
        }
    }

    component SessionButton: ButtonBase {
        id: button

        required property list<string> command
        required property string label
        property string icon

        readonly property real preferredWidth: Math.max(
            Tokens.sizes.session.button,
            content.implicitWidth + Tokens.padding.medium * 2
        )

        function exec(): void {
            if (!SessionManager.exec(command))
                Quickshell.execDetached(command);
        }

        implicitWidth: root.buttonWidth
        implicitHeight: content.implicitHeight + Tokens.padding.medium * 2

        inactiveColour: activeFocus ? Colours.palette.m3secondaryContainer : Colours.tPalette.m3surfaceContainer
        inactiveOnColour: activeFocus ? Colours.palette.m3onSecondaryContainer : Colours.palette.m3onSurface
        radius: pressed ? Tokens.rounding.medium : activeFocus ? Tokens.rounding.extraLarge : Tokens.rounding.largeIncreased
        onClicked: exec()

        Keys.onEnterPressed: exec()
        Keys.onReturnPressed: exec()
        Keys.onEscapePressed: root.visibilities.session = false
        Keys.onPressed: event => {
            if (!Config.session.vimKeybinds)
                return;

            if (event.modifiers & Qt.ControlModifier) {
                if ((event.key === Qt.Key_J || event.key === Qt.Key_N) && KeyNavigation.down) {
                    KeyNavigation.down.focus = true;
                    event.accepted = true;
                } else if ((event.key === Qt.Key_K || event.key === Qt.Key_P) && KeyNavigation.up) {
                    KeyNavigation.up.focus = true;
                    event.accepted = true;
                }
            } else if (event.key === Qt.Key_Tab && KeyNavigation.down) {
                KeyNavigation.down.focus = true;
                event.accepted = true;
            } else if (event.key === Qt.Key_Backtab || (event.key === Qt.Key_Tab && (event.modifiers & Qt.ShiftModifier))) {
                if (KeyNavigation.up) {
                    KeyNavigation.up.focus = true;
                    event.accepted = true;
                }
            }
        }

        Column {
            id: content

            anchors.centerIn: parent
            spacing: Tokens.spacing.extraSmall

            MaterialIcon {
                anchors.horizontalCenter: parent.horizontalCenter
                text: button.icon
                color: button.onColour
                fontStyle: Tokens.font.icon.builders.large.scale(1.3).build()
            }

            StyledText {
                anchors.horizontalCenter: parent.horizontalCenter
                text: button.label
                color: button.onColour
                font: Tokens.font.label.small
                horizontalAlignment: Text.AlignHCenter
            }
        }
    }
}
