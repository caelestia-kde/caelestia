pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Quickshell
import Caelestia.Config
import qs.components
import qs.components.controls
import qs.components.effects
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
    property int expandedIndex: -1

    signal entryMoved(from: int, to: int)
    signal entryRemoved(index: int)
    signal entryLabelChanged(index: int, label: string)
    signal entryIconChanged(index: int, icon: string)
    signal entryCommandChanged(index: int, command: var)
    signal entryMediaChanged(index: int, media: string)

    function collapse(): void {
        expandedIndex = -1;
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

    function dampOvershoot(overshoot: real, maxOvershoot: real): real {
        return overshoot / (1 + overshoot / maxOvershoot);
    }

    Layout.fillWidth: true
    spacing: Tokens.spacing.extraSmall / 2

    onEntriesChanged: {
        if (expandedIndex >= (entries?.length ?? 0))
            expandedIndex = -1;
    }

    ConnectedRect {
        Layout.fillWidth: true
        first: root.first
        last: root.last
        visible: listView.count === 0
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

    ListView {
        id: listView

        Layout.fillWidth: true
        implicitHeight: contentHeight
        visible: count > 0
        spacing: Tokens.spacing.extraSmall / 2
        interactive: false

        model: DelegateModel {
            id: visualModel

            model: ScriptModel {
                id: entriesModel

                values: root.entries ?? []
            }

            delegate: EntryCard {}
        }

        add: Transition {
            Anim {
                properties: "opacity"
                type: Anim.DefaultEffects
                from: 0
                to: 1
            }
        }

        remove: Transition {
            Anim {
                properties: "opacity"
                type: Anim.DefaultEffects
                to: 0
            }
        }

        move: Transition {
            Anim {
                properties: "opacity"
                type: Anim.DefaultEffects
                to: 1
            }
            Anim {
                properties: "y"
            }
        }

        displaced: Transition {
            Anim {
                properties: "opacity"
                type: Anim.DefaultEffects
                to: 1
            }
            Anim {
                properties: "y"
            }
        }

        Behavior on implicitHeight {
            Anim {}
        }
    }

    component EntryCard: Item {
        id: card

        required property var modelData

        readonly property int itemIndex: DelegateModel.itemsIndex
        readonly property bool isMedia: modelData?.type === "media"
        readonly property bool isPredefined: !isMedia && Boolean(modelData?.id) && (root?.predefinedIds?.includes(modelData.id) ?? false)
        readonly property bool isExpanded: !held && (root?.expandedIndex ?? -1) === itemIndex
        readonly property bool useDino: isMedia && GlobalConfig.general.caelestiaMode && modelData?.id === "gif" && !(modelData?.media)
        readonly property string resolvedLabel: root?.resolvedLabel(modelData) ?? ""
        readonly property string resolvedIcon: root?.resolvedIcon(modelData) ?? "help_outline"
        readonly property string commandText: root?.commandString(root?.resolvedCommand(modelData)) ?? ""
        readonly property string rawMedia: modelData?.media ?? ""
        readonly property string mediaSource: useDino ? "root:/assets/dino.gif" : (root?.resolvedMedia(modelData) ?? "")
        readonly property string mediaDisplayName: {
            if (useDino)
                return qsTr("dino.gif (Caelestia mode)");
            if (!mediaSource)
                return qsTr("No media selected");
            return mediaSource.split("/").pop();
        }

        property bool held
        property point pressPos
        property int pressIndex
        property real lastMoveY
        property real topRadius: root?.first && itemIndex === 0 ? Tokens.rounding.extraLarge : Tokens.rounding.extraSmall
        property real bottomRadius: root?.last && itemIndex === (listView?.count ?? 0) - 1 ? Tokens.rounding.extraLarge : Tokens.rounding.extraSmall
        property real radiusLerpProg

        function lerpRadius(a: real, b: real): real {
            return a + (b - a) * radiusLerpProg;
        }

        anchors.left: listView?.contentItem.left
        anchors.right: listView?.contentItem.right
        implicitHeight: cardColumn.implicitHeight + Tokens.padding.medium * 2
        z: held || returnAnim.running ? 1 : 0
        state: held ? "held" : ""

        states: State {
            name: "held"

            PropertyChanges {
                card.radiusLerpProg: 1
                placeholder.opacity: 0.1
                elevation.opacity: 1
                cardBg.color: Colours.palette.m3primaryContainer
                dragIcon.color: Colours.palette.m3onPrimaryContainer
                titleText.color: Colours.palette.m3onPrimaryContainer
            }
        }

        transitions: Transition {
            Anim {
                properties: "opacity,radiusLerpProg"
                type: Anim.SlowEffects
            }
            PropertyAction {
                properties: "color"
            }
        }

        Behavior on topRadius {
            Anim {
                type: Anim.DefaultEffects
            }
        }

        Behavior on bottomRadius {
            Anim {
                type: Anim.DefaultEffects
            }
        }

        StyledRect {
            id: placeholder

            anchors.fill: parent
            color: Colours.palette.m3primary
            radius: Tokens.rounding.extraSmall
            topLeftRadius: card.topRadius
            topRightRadius: card.topRadius
            bottomLeftRadius: card.bottomRadius
            bottomRightRadius: card.bottomRadius
            opacity: 0
        }

        Anim {
            id: returnAnim

            target: cardContent
            properties: "x,y"
            to: 0
        }

        MouseArea {
            id: dragMouse

            anchors.left: parent.left
            anchors.top: parent.top
            width: Math.max(0, card.width - actionButtons.width - Tokens.padding.large - Tokens.spacing.medium)
            height: headerContainer.height + Tokens.padding.medium * 2
            preventStealing: true
            cursorShape: pressed ? Qt.ClosedHandCursor : Qt.OpenHandCursor

            onPressed: e => {
                root.collapse();
                returnAnim.stop();
                card.pressPos = Qt.point(e.x, e.y);
                card.pressIndex = card.DelegateModel.itemsIndex;
                card.lastMoveY = card.y;
                card.held = true;

                cardContent.x = Qt.binding(() => {
                    if (!root)
                        return 0;

                    const maxOvershoot = Tokens.padding.extraExtraLarge;
                    const x = dragMouse.mouseX - card.pressPos.x;
                    return root.dampOvershoot(Math.abs(x), maxOvershoot) * Math.sign(x);
                });
                cardContent.y = Qt.binding(() => {
                    if (!root || !listView)
                        return 0;

                    const maxOvershoot = Tokens.padding.extraLarge;
                    const yDiff = card.y - card.lastMoveY;
                    const y = dragMouse.mouseY - card.pressPos.y - yDiff;
                    const absY = card.mapToItem(listView.contentItem, 0, y).y;
                    const maxY = listView.implicitHeight - card.implicitHeight;
                    if (absY < 0)
                        return y - absY - root.dampOvershoot(-absY, maxOvershoot);
                    if (absY > maxY)
                        return y - absY + maxY + root.dampOvershoot(absY - maxY, maxOvershoot);
                    return y;
                });
            }

            onPositionChanged: e => {
                card.lastMoveY = card.y;
                const absY = card.mapToItem(listView.contentItem, 0, e.y).y;

                const swap = listView.itemAt(0, absY);
                if (!swap || swap === card)
                    return;

                const idx = card.DelegateModel.itemsIndex;
                const swapIdx = swap.DelegateModel.itemsIndex;
                visualModel.items.move(idx, swapIdx);
            }

            onReleased: {
                cardContent.x = cardContent.x;
                cardContent.y = cardContent.y;
                returnAnim.start();
                card.held = false;

                const idx = card.DelegateModel.itemsIndex;
                if (idx !== card.pressIndex)
                    root.entryMoved(card.pressIndex, idx);
            }
        }

        Item {
            id: cardContent

            implicitWidth: card.width
            implicitHeight: card.implicitHeight

            Elevation {
                id: elevation

                anchors.fill: parent
                radius: cardBg.radius
                topLeftRadius: cardBg.topLeftRadius
                topRightRadius: cardBg.topRightRadius
                bottomLeftRadius: cardBg.bottomLeftRadius
                bottomRightRadius: cardBg.bottomRightRadius
                level: 3
                opacity: 0
            }

            StyledRect {
                id: cardBg

                anchors.fill: parent
                color: card.isExpanded ? Colours.layer(Colours.palette.m3surfaceContainerHigh, 1) : Colours.tPalette.m3surfaceContainer
                radius: card.lerpRadius(Tokens.rounding.extraSmall, Tokens.rounding.large)
                topLeftRadius: card.lerpRadius(card.topRadius, Tokens.rounding.large)
                topRightRadius: card.lerpRadius(card.topRadius, Tokens.rounding.large)
                bottomLeftRadius: card.lerpRadius(card.bottomRadius, Tokens.rounding.large)
                bottomRightRadius: card.lerpRadius(card.bottomRadius, Tokens.rounding.large)

                Behavior on color {
                    CAnim {}
                }
            }

            MouseArea {
                id: hoverLayer

                anchors.fill: parent
                acceptedButtons: Qt.NoButton
                hoverEnabled: true

                StyledRect {
                    anchors.fill: parent
                    radius: cardBg.radius
                    topLeftRadius: cardBg.topLeftRadius
                    topRightRadius: cardBg.topRightRadius
                    bottomLeftRadius: cardBg.bottomLeftRadius
                    bottomRightRadius: cardBg.bottomRightRadius
                    color: Colours.palette.m3onSurface
                    opacity: parent.containsMouse && !card.held && !card.isExpanded ? 0.06 : 0

                    Behavior on opacity {
                        Anim {
                            type: Anim.DefaultEffects
                        }
                    }
                }
            }

            ColumnLayout {
                id: cardColumn

                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: Tokens.padding.medium
                anchors.leftMargin: Tokens.padding.largeIncreased
                anchors.rightMargin: Tokens.padding.large
                spacing: Tokens.spacing.medium

                Item {
                    id: headerContainer

                    Layout.fillWidth: true
                    implicitHeight: headerRow.implicitHeight

                    RowLayout {
                        id: headerRow

                        anchors.fill: parent
                        spacing: Tokens.spacing.medium

                        MaterialIcon {
                            id: dragIcon

                            text: "drag_indicator"
                            color: Colours.palette.m3onSurfaceVariant
                            fontStyle: Tokens.font.icon.medium
                        }

                        StyledClippingRect {
                            Layout.preferredWidth: 40
                            Layout.preferredHeight: 40
                            radius: Tokens.rounding.medium
                            color: Colours.layer(Colours.palette.m3surfaceContainerHighest, 1)

                            MaterialIcon {
                                anchors.centerIn: parent
                                visible: !card.isMedia
                                text: card.resolvedIcon.length > 0 ? card.resolvedIcon : "help"
                                color: Colours.palette.m3primary
                                fontStyle: Tokens.font.icon.medium
                            }

                            MediaView {
                                anchors.fill: parent
                                anchors.margins: Tokens.padding.extraSmall
                                visible: card.isMedia && card.mediaSource !== ""
                                path: card.mediaSource
                                speed: root?.mediaSpeed ?? 1.0
                                playing: (root?.visible ?? false) && visible
                                colourise: card.useDino
                            }

                            MaterialIcon {
                                anchors.centerIn: parent
                                visible: card.isMedia && card.mediaSource === ""
                                text: "perm_media"
                                color: Colours.palette.m3onSurfaceVariant
                                fontStyle: Tokens.font.icon.medium
                            }
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 0

                            StyledText {
                                id: titleText

                                Layout.fillWidth: true
                                text: card.resolvedLabel || (card.isMedia ? qsTr("Session media") : qsTr("Untitled entry"))
                                color: Colours.palette.m3onSurface
                                font: Tokens.font.body.medium
                                elide: Text.ElideRight
                            }

                            StyledText {
                                Layout.fillWidth: true
                                text: {
                                    if (card.isMedia)
                                        return `${qsTr("Media")} · ${card.mediaDisplayName}`;
                                    if (card.isPredefined)
                                        return `${qsTr("Predefined")} · ${card.commandText}`;
                                    return `${qsTr("Custom")} · ${card.commandText || qsTr("No command")}`;
                                }
                                color: Colours.palette.m3onSurfaceVariant
                                font: NexusStyle.secondaryFont
                                elide: Text.ElideRight
                            }
                        }

                        RowLayout {
                            id: actionButtons

                            spacing: Tokens.spacing.extraSmall

                            IconButton {
                                type: IconButton.Text
                                isRound: true
                                icon: card.isExpanded ? "expand_less" : "edit"
                                accessibleName: card.isExpanded ? qsTr("Collapse entry") : qsTr("Edit entry")
                                font: Tokens.font.icon.medium
                                label.fill: 0
                                onClicked: root.expandedIndex = card.isExpanded ? -1 : card.itemIndex
                            }

                            IconButton {
                                type: IconButton.Text
                                isRound: true
                                icon: "delete"
                                accessibleName: qsTr("Remove entry")
                                inactiveOnColour: Colours.palette.m3error
                                font: Tokens.font.icon.medium
                                label.fill: 0
                                onClicked: root.entryRemoved(card.itemIndex)
                            }
                        }
                    }
                }

                Loader {
                    id: editorLoader

                    Layout.fillWidth: true
                    active: card.isExpanded
                    visible: active
                    sourceComponent: card.isMedia ? mediaEditor : buttonEditor
                }
            }
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
                        text: card.resolvedLabel
                        onEditingFinished: root.entryLabelChanged(card.itemIndex, text)
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
                        text: card.resolvedIcon
                        onEditingFinished: root.entryIconChanged(card.itemIndex, text)
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
                        visible: !card.isPredefined
                        type: StyledTextField.Boxed
                        Layout.fillWidth: true
                        horizontalAlignment: TextInput.AlignLeft
                        Accessible.name: qsTr("Command")
                        placeholderText: text.length === 0 ? qsTr("e.g. systemctl suspend") : ""
                        text: card.commandText
                        onEditingFinished: root.entryCommandChanged(card.itemIndex, root.commandList(text))
                    }

                    StyledText {
                        visible: card.isPredefined
                        Layout.fillWidth: true
                        text: qsTr("Shared with Launcher: %1").arg(card.commandText)
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
                            visible: card.mediaSource !== ""
                            path: card.mediaSource
                            speed: root.mediaSpeed
                            playing: root.visible && card.isExpanded && visible
                            colourise: card.useDino
                        }

                        MaterialIcon {
                            anchors.centerIn: parent
                            visible: card.mediaSource === ""
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
                            text: card.mediaSource ? Paths.shortenHome(card.mediaSource) : qsTr("No media file selected")
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
                                visible: card.rawMedia !== ""
                                type: TextButton.Text
                                text: qsTr("Reset default")
                                onClicked: root.entryMediaChanged(card.itemIndex, "")
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
                    onAccepted: path => root.entryMediaChanged(card.itemIndex, path)
                }
            }
        }
    }
}
