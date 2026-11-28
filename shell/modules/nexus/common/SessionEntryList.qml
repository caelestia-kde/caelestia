pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Caelestia.Config
import qs.components
import qs.components.controls
import qs.components.filedialog
import qs.components.images
import qs.services
import qs.utils
import qs.modules.nexus.common

ColumnLayout {
    id: root

    property var entries: []
    property var predefinedIds: []
    property var defaultLabels: ({})
    property real mediaSpeed: Config.general.sessionGifSpeed
    property bool first: true
    property bool last: false

    signal entryMoved(from: int, to: int)
    signal entryRemoved(index: int)
    signal entryLabelChanged(index: int, label: string)
    signal entryIconChanged(index: int, icon: string)
    signal entryCommandChanged(index: int, command: var)
    signal entryMediaChanged(index: int, media: string)

    function collapse(): void {
        listEditor.collapse();
    }

    function isMediaEntry(entry: var): bool {
        return entry?.type === "media";
    }

    function isPredefinedEntry(entry: var): bool {
        return !isMediaEntry(entry) && Boolean(entry?.id) && predefinedIds.includes(entry.id);
    }

    function useDinoFor(entry: var): bool {
        return isMediaEntry(entry) && GlobalConfig.general.caelestiaMode && entry?.id === "gif" && !(entry?.media);
    }

    function resolvedLabel(entry: var): string {
        if (!entry)
            return "";
        if (entry.label && entry.label.length > 0)
            return entry.label;
        return defaultLabels[entry.id] ?? "";
    }

    function resolvedIcon(entry: var): string {
        if (!entry)
            return "help_outline";
        if (entry.icon && entry.icon.length > 0)
            return entry.icon;
        if (entry.id && predefinedIds.includes(entry.id))
            return Config.session.icons[entry.id] || "help_outline";
        return "help_outline";
    }

    function resolvedCommand(entry: var): var {
        if (!entry)
            return [];
        if (entry.id && predefinedIds.includes(entry.id))
            return Config.session.commands[entry.id] ?? [];
        return entry.command ?? [];
    }

    function commandString(list: var): string {
        return (list || []).join(" ");
    }

    function commandList(text: string): var {
        return text.trim().split(/\s+/).filter(s => s.length > 0);
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

    function mediaSourceFor(entry: var): string {
        return useDinoFor(entry) ? "root:/assets/dino.gif" : resolvedMedia(entry);
    }

    function mediaDisplayNameFor(entry: var): string {
        if (useDinoFor(entry))
            return qsTr("dino.gif (Caelestia mode)");
        const src = mediaSourceFor(entry);
        return src ? src.split("/").pop() : qsTr("No media selected");
    }

    Layout.fillWidth: true
    spacing: Tokens.spacing.extraSmall / 2

    ConnectedRect {
        Layout.fillWidth: true
        first: root.first
        last: root.last
        visible: (root.entries?.length ?? 0) === 0
        implicitHeight: emptyCol.implicitHeight + Tokens.padding.extraLarge * 2

        ColumnLayout {
            id: emptyCol

            anchors.centerIn: parent
            spacing: Tokens.spacing.extraSmall

            MaterialIcon {
                Layout.alignment: Qt.AlignHCenter
                text: "power_settings_new"
                color: Colours.palette.m3onSurfaceVariant
                fontStyle: Tokens.font.icon.large
            }

            StyledText {
                Layout.alignment: Qt.AlignHCenter
                text: qsTr("No session entries configured")
                color: Colours.palette.m3onSurfaceVariant
                font: Tokens.font.body.medium
            }
        }
    }

    ListEditor {
        id: listEditor

        function labelFor(item: var): string {
            return root.resolvedLabel(item) || (root.isMediaEntry(item) ? qsTr("Session media") : qsTr("Untitled entry"));
        }

        function subtextFor(item: var): string {
            if (root.isMediaEntry(item))
                return `${qsTr("Media")} · ${root.mediaDisplayNameFor(item)}`;
            const cmd = root.commandString(root.resolvedCommand(item));
            if (root.isPredefinedEntry(item))
                return `${qsTr("Predefined")} · ${cmd}`;
            return `${qsTr("Custom")} · ${cmd || qsTr("No command")}`;
        }

        visible: (root.entries?.length ?? 0) > 0
        first: root.first
        last: root.last
        values: root.entries ?? []
        allowToggle: false
        allowRemove: true
        allowExpand: true

        onItemMoved: (from, to) => root.entryMoved(from, to)
        onItemRemoved: index => root.entryRemoved(index)

        leadingComponent: Component {
            StyledClippingRect {
                id: badge

                property var modelData: null
                property int itemIndex: -1

                readonly property bool isMedia: root?.isMediaEntry(modelData) ?? false
                readonly property bool useDino: root?.useDinoFor(modelData) ?? false
                readonly property string mediaSource: root?.mediaSourceFor(modelData) ?? ""
                readonly property string iconName: root?.resolvedIcon(modelData) ?? "help_outline"

                implicitWidth: 40
                implicitHeight: 40
                radius: Tokens.rounding.medium
                color: Colours.layer(Colours.palette.m3surfaceContainerHighest, 1)

                MaterialIcon {
                    anchors.centerIn: parent
                    visible: !badge.isMedia
                    text: badge.iconName.length > 0 ? badge.iconName : "help"
                    color: Colours.palette.m3primary
                    fontStyle: Tokens.font.icon.medium
                }

                MediaView {
                    anchors.fill: parent
                    anchors.margins: Tokens.padding.extraSmall
                    visible: badge.isMedia && badge.mediaSource !== ""
                    path: badge.mediaSource
                    speed: root?.mediaSpeed ?? 1.0
                    playing: (root?.visible ?? false) && visible
                    colourise: badge.useDino
                }

                MaterialIcon {
                    anchors.centerIn: parent
                    visible: badge.isMedia && badge.mediaSource === ""
                    text: "perm_media"
                    color: Colours.palette.m3onSurfaceVariant
                    fontStyle: Tokens.font.icon.medium
                }
            }
        }

        expandedComponent: Component {
            Item {
                id: editorHost

                property var modelData: null
                property int itemIndex: -1

                readonly property bool isMedia: root?.isMediaEntry(modelData) ?? false
                readonly property bool isPredefined: root?.isPredefinedEntry(modelData) ?? false
                readonly property bool useDino: root?.useDinoFor(modelData) ?? false
                readonly property string resolvedLabel: root?.resolvedLabel(modelData) ?? ""
                readonly property string resolvedIcon: root?.resolvedIcon(modelData) ?? "help_outline"
                readonly property string commandText: root?.commandString(root?.resolvedCommand(modelData)) ?? ""
                readonly property string rawMedia: modelData?.media ?? ""
                readonly property string mediaSource: root?.mediaSourceFor(modelData) ?? ""

                implicitHeight: innerLoader.status === Loader.Ready && innerLoader.item ? innerLoader.item.implicitHeight : 0

                Loader {
                    id: innerLoader

                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    sourceComponent: editorHost.isMedia ? mediaEditor : buttonEditor
                }

                Component {
                    id: buttonEditor

                    ColumnLayout {
                        spacing: Tokens.spacing.small

                        StyledRect {
                            Layout.fillWidth: true
                            implicitHeight: 1
                            color: Colours.palette.m3outlineVariant
                        }

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: Tokens.spacing.medium

                            StyledText {
                                Layout.preferredWidth: 112
                                text: qsTr("Label")
                                font: Tokens.font.body.small
                                color: Colours.palette.m3onSurface
                            }

                            StyledTextField {
                                id: labelField

                                type: StyledTextField.Boxed
                                Layout.fillWidth: true
                                horizontalAlignment: TextInput.AlignLeft
                                Accessible.name: qsTr("Button label")
                                placeholderText: text.length === 0 ? qsTr("Button label") : ""
                                text: editorHost.resolvedLabel
                                onEditingFinished: root?.entryLabelChanged(editorHost.itemIndex, text)
                            }
                        }

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: Tokens.spacing.medium

                            StyledText {
                                Layout.preferredWidth: 112
                                text: qsTr("Icon")
                                font: Tokens.font.body.small
                                color: Colours.palette.m3onSurface
                            }

                            MaterialIcon {
                                text: iconField.text.length > 0 ? iconField.text : "help"
                                color: Colours.palette.m3onSurfaceVariant
                                fontStyle: Tokens.font.icon.medium
                            }

                            StyledTextField {
                                id: iconField

                                type: StyledTextField.Boxed
                                Layout.fillWidth: true
                                horizontalAlignment: TextInput.AlignLeft
                                Accessible.name: qsTr("Material icon name")
                                placeholderText: text.length === 0 ? qsTr("Material icon name") : ""
                                text: editorHost.resolvedIcon
                                onEditingFinished: root?.entryIconChanged(editorHost.itemIndex, text)
                            }
                        }

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: Tokens.spacing.medium

                            StyledText {
                                Layout.preferredWidth: 112
                                text: qsTr("Command")
                                font: Tokens.font.body.small
                                color: Colours.palette.m3onSurface
                            }

                            StyledTextField {
                                visible: !editorHost.isPredefined
                                type: StyledTextField.Boxed
                                Layout.fillWidth: true
                                horizontalAlignment: TextInput.AlignLeft
                                Accessible.name: qsTr("Command")
                                placeholderText: text.length === 0 ? qsTr("e.g. systemctl suspend") : ""
                                text: editorHost.commandText
                                onEditingFinished: root?.entryCommandChanged(editorHost.itemIndex, root.commandList(text))
                            }

                            StyledText {
                                visible: editorHost.isPredefined
                                Layout.fillWidth: true
                                text: qsTr("Shared with Launcher: %1").arg(editorHost.commandText)
                                color: Colours.palette.m3onSurfaceVariant
                                font: NexusStyle.secondaryFont
                                wrapMode: Text.WordWrap
                            }
                        }
                    }
                }

                Component {
                    id: mediaEditor

                    ColumnLayout {
                        spacing: Tokens.spacing.small

                        StyledRect {
                            Layout.fillWidth: true
                            implicitHeight: 1
                            color: Colours.palette.m3outlineVariant
                        }

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: Tokens.spacing.medium

                            StyledClippingRect {
                                Layout.preferredWidth: 88
                                Layout.preferredHeight: 88
                                radius: Tokens.rounding.large
                                color: Colours.layer(Colours.palette.m3surfaceContainerHighest, 1)

                                MediaView {
                                    anchors.fill: parent
                                    anchors.margins: Tokens.padding.small
                                    visible: editorHost.mediaSource !== ""
                                    path: editorHost.mediaSource
                                    speed: root?.mediaSpeed ?? 1.0
                                    playing: (root?.visible ?? false) && visible
                                    colourise: editorHost.useDino
                                }

                                MaterialIcon {
                                    anchors.centerIn: parent
                                    visible: editorHost.mediaSource === ""
                                    text: "perm_media"
                                    color: Colours.palette.m3onSurfaceVariant
                                    fontStyle: Tokens.font.icon.large
                                }
                            }

                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: Tokens.spacing.small

                                StyledText {
                                    Layout.fillWidth: true
                                    text: editorHost.mediaSource ? Paths.shortenHome(editorHost.mediaSource) : qsTr("No media file selected")
                                    color: Colours.palette.m3onSurfaceVariant
                                    font: NexusStyle.secondaryFont
                                    elide: Text.ElideMiddle
                                }

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: Tokens.spacing.small

                                    IconTextButton {
                                        type: TextButton.Tonal
                                        icon: "folder_open"
                                        text: qsTr("Choose media")
                                        onClicked: mediaDialog.open()
                                    }

                                    TextButton {
                                        visible: editorHost.rawMedia !== ""
                                        type: TextButton.Text
                                        text: qsTr("Reset default")
                                        onClicked: root?.entryMediaChanged(editorHost.itemIndex, "")
                                    }
                                }

                                StyledText {
                                    Layout.fillWidth: true
                                    text: qsTr("Supports images, SVG, GIF, WebP, and videos (MP4, WebM, MKV, MOV, AVI)")
                                    color: Colours.palette.m3onSurfaceVariant
                                    font: Tokens.font.label.small
                                    wrapMode: Text.WordWrap
                                }
                            }
                        }

                        FileDialog {
                            id: mediaDialog

                            title: qsTr("Select session media")
                            filterLabel: qsTr("Multimedia files (Images, GIFs, Videos)")
                            filters: Images.validImageExtensions.concat(Images.validVideoExtensions)
                            onAccepted: path => root?.entryMediaChanged(editorHost.itemIndex, path)
                        }
                    }
                }
            }
        }
    }
}
