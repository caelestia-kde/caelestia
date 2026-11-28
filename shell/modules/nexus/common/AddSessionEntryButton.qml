pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Caelestia.Config
import qs.components
import qs.components.containers
import qs.components.controls
import qs.components.filedialog
import qs.components.images
import qs.services
import qs.utils
import qs.modules.nexus.common

DialogRowButton {
    id: root

    property var predefinedItems: []
    property string mode: "predefined"
    property string selectedPredefinedId: ""
    property string customLabel: ""
    property string customIcon: "terminal"
    property string customCommand: ""
    property string customMediaLabel: ""
    property string customMediaPath: ""

    signal addPredefined(id: string)
    signal addCustom(label: string, icon: string, command: string)
    signal addMedia(label: string, mediaPath: string)

    function resetDraft(): void {
        mode = root.predefinedItems.length > 0 ? "predefined" : "custom";
        selectedPredefinedId = "";
        customLabel = "";
        customIcon = "terminal";
        customCommand = "";
        customMediaLabel = qsTr("Session media");
        customMediaPath = "";
    }

    icon: "add"
    label: qsTr("Add entry")
    header: qsTr("Add session entry")
    acceptLabel: qsTr("Add")
    separateContent: true
    openHeight: Math.min(rootParent.height * 0.85, Tokens.sizes.nexus.maxDialogHeight)

    acceptAllowed: {
        if (mode === "predefined")
            return selectedPredefinedId !== "";
        if (mode === "custom")
            return customLabel.trim().length > 0 && customCommand.trim().length > 0;
        return true;
    }

    onOpenChanged: {
        if (open)
            resetDraft();
    }

    onAccepted: {
        if (mode === "predefined" && selectedPredefinedId !== "")
            addPredefined(selectedPredefinedId);
        else if (mode === "custom")
            addCustom(customLabel.trim(), customIcon.trim() || "terminal", customCommand.trim());
        else if (mode === "media")
            addMedia(customMediaLabel.trim() || qsTr("Session media"), customMediaPath);
    }

    content: Component {
        ColumnLayout {
            spacing: Tokens.spacing.medium

            RowLayout {
                Layout.fillWidth: true
                Layout.topMargin: Tokens.spacing.medium
                spacing: Tokens.spacing.small

                ModeTab {
                    tabMode: "predefined"
                    tabIcon: "apps"
                    tabLabel: qsTr("Predefined")
                }

                ModeTab {
                    tabMode: "custom"
                    tabIcon: "tune"
                    tabLabel: qsTr("Custom")
                }

                ModeTab {
                    tabMode: "media"
                    tabIcon: "perm_media"
                    tabLabel: qsTr("Media")
                }
            }

            Loader {
                Layout.fillWidth: true
                Layout.fillHeight: true
                sourceComponent: root.mode === "predefined" ? predefinedComp : root.mode === "custom" ? customComp : mediaComp
            }

            Component {
                id: predefinedComp

                Item {
                    ColumnLayout {
                        anchors.centerIn: parent
                        width: parent.width - Tokens.padding.large * 2
                        visible: root.predefinedItems.length === 0
                        spacing: Tokens.spacing.extraSmall

                        MaterialIcon {
                            Layout.alignment: Qt.AlignHCenter
                            text: "check_circle"
                            color: Colours.palette.m3onSurfaceVariant
                            fontStyle: Tokens.font.icon.large
                        }

                        StyledText {
                            Layout.alignment: Qt.AlignHCenter
                            Layout.fillWidth: true
                            text: qsTr("All predefined entries are already in the menu")
                            color: Colours.palette.m3onSurfaceVariant
                            font: Tokens.font.body.medium
                            horizontalAlignment: Text.AlignHCenter
                            wrapMode: Text.WordWrap
                        }
                    }

                    VerticalFadeListView {
                        anchors.fill: parent
                        visible: root.predefinedItems.length > 0
                        spacing: 0
                        topMargin: Tokens.padding.small
                        bottomMargin: Tokens.padding.small
                        model: root.predefinedItems

                        delegate: StyledRect {
                            id: item

                            required property var modelData
                            readonly property bool selected: root.selectedPredefinedId === modelData.id

                            anchors.left: ListView.view.contentItem.left
                            anchors.right: ListView.view.contentItem.right
                            anchors.margins: 1
                            implicitHeight: predefRow.implicitHeight + Tokens.padding.medium * 2
                            radius: stateLayer.pressed ? Tokens.rounding.extraSmall : selected ? Tokens.rounding.largeIncreased : Tokens.rounding.medium
                            color: Qt.alpha(Colours.palette.m3tertiaryContainer, selected ? 1 : 0)

                            Behavior on radius {
                                Anim {
                                    type: Anim.SlowEffects
                                }
                            }

                            StateLayer {
                                id: stateLayer

                                onClicked: root.selectedPredefinedId = item.modelData.id
                            }

                            RowLayout {
                                id: predefRow

                                anchors.left: parent.left
                                anchors.right: parent.right
                                anchors.verticalCenter: parent.verticalCenter
                                anchors.margins: Tokens.padding.large
                                spacing: Tokens.spacing.medium

                                MaterialIcon {
                                    text: item.modelData.icon
                                    color: item.selected ? Colours.palette.m3onTertiaryContainer : Colours.palette.m3primary
                                    fontStyle: Tokens.font.icon.medium
                                }

                                ColumnLayout {
                                    Layout.fillWidth: true
                                    spacing: 0

                                    StyledText {
                                        Layout.fillWidth: true
                                        text: item.modelData.label
                                        color: item.selected ? Colours.palette.m3onTertiaryContainer : Colours.palette.m3onSurface
                                        elide: Text.ElideRight
                                    }

                                    StyledText {
                                        Layout.fillWidth: true
                                        text: item.modelData.commandText
                                        color: item.selected ? Colours.palette.m3onTertiaryContainer : Colours.palette.m3onSurfaceVariant
                                        font: NexusStyle.secondaryFont
                                        elide: Text.ElideRight
                                    }
                                }

                                MaterialIcon {
                                    text: "check"
                                    color: Colours.palette.m3onTertiaryContainer
                                    fontStyle: Tokens.font.icon.medium
                                    opacity: item.selected ? 1 : 0

                                    Behavior on opacity {
                                        Anim {
                                            type: Anim.SlowEffects
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Component {
                id: customComp

                ColumnLayout {
                    spacing: Tokens.spacing.medium

                    StyledText {
                        Layout.fillWidth: true
                        text: qsTr("Add a custom session button with your own label, icon, and shell command.")
                        color: Colours.palette.m3onSurfaceVariant
                        font: NexusStyle.secondaryFont
                        wrapMode: Text.WordWrap
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: Tokens.spacing.medium

                        StyledText {
                            Layout.preferredWidth: 88
                            text: qsTr("Label")
                            font: Tokens.font.body.small
                        }

                        StyledTextField {
                            type: StyledTextField.Boxed
                            Layout.fillWidth: true
                            horizontalAlignment: TextInput.AlignLeft
                            Accessible.name: qsTr("Button label")
                            placeholderText: text.length === 0 ? qsTr("e.g. Suspend") : ""
                            text: root.customLabel
                            onTextChanged: root.customLabel = text
                        }
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: Tokens.spacing.medium

                        StyledText {
                            Layout.preferredWidth: 88
                            text: qsTr("Icon")
                            font: Tokens.font.body.small
                        }

                        MaterialIcon {
                            text: root.customIcon.trim().length > 0 ? root.customIcon.trim() : "help"
                            color: Colours.palette.m3primary
                            fontStyle: Tokens.font.icon.medium
                        }

                        StyledTextField {
                            type: StyledTextField.Boxed
                            Layout.fillWidth: true
                            horizontalAlignment: TextInput.AlignLeft
                            Accessible.name: qsTr("Material icon name")
                            placeholderText: text.length === 0 ? qsTr("Material icon name") : ""
                            text: root.customIcon
                            onTextChanged: root.customIcon = text
                        }
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: Tokens.spacing.medium

                        StyledText {
                            Layout.preferredWidth: 88
                            text: qsTr("Command")
                            font: Tokens.font.body.small
                        }

                        StyledTextField {
                            type: StyledTextField.Boxed
                            Layout.fillWidth: true
                            horizontalAlignment: TextInput.AlignLeft
                            Accessible.name: qsTr("Command")
                            placeholderText: text.length === 0 ? qsTr("e.g. systemctl suspend") : ""
                            text: root.customCommand
                            onTextChanged: root.customCommand = text
                        }
                    }

                    Item {
                        Layout.fillHeight: true
                    }
                }
            }

            Component {
                id: mediaComp

                ColumnLayout {
                    spacing: Tokens.spacing.medium

                    StyledText {
                        Layout.fillWidth: true
                        text: qsTr("Add an image, SVG, GIF, WebP, or video slot to the session menu.")
                        color: Colours.palette.m3onSurfaceVariant
                        font: NexusStyle.secondaryFont
                        wrapMode: Text.WordWrap
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: Tokens.spacing.medium

                        StyledClippingRect {
                            Layout.preferredWidth: 84
                            Layout.preferredHeight: 84
                            radius: Tokens.rounding.large
                            color: Colours.layer(Colours.palette.m3surfaceContainerHighest, 1)

                            MediaView {
                                anchors.fill: parent
                                anchors.margins: Tokens.padding.small
                                path: root.customMediaPath || Config.paths.sessionGif
                                speed: Config.general.sessionGifSpeed
                                playing: root.open && root.mode === "media"
                            }
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: Tokens.spacing.small

                            StyledText {
                                Layout.fillWidth: true
                                text: root.customMediaPath ? Paths.shortenHome(root.customMediaPath) : qsTr("Default (%1)").arg(Config.paths.sessionGif.split("/").pop())
                                color: Colours.palette.m3onSurfaceVariant
                                font: NexusStyle.secondaryFont
                                elide: Text.ElideMiddle
                            }

                            IconTextButton {
                                type: TextButton.Tonal
                                icon: "folder_open"
                                text: qsTr("Choose media")
                                onClicked: addMediaDialog.open()
                            }
                        }
                    }

                    FileDialog {
                        id: addMediaDialog

                        title: qsTr("Select session media")
                        filterLabel: qsTr("Multimedia files (Images, GIFs, Videos)")
                        filters: Images.validImageExtensions.concat(Images.validVideoExtensions)
                        onAccepted: path => root.customMediaPath = path
                    }

                    Item {
                        Layout.fillHeight: true
                    }
                }
            }
        }
    }

    component ModeTab: IconTextButton {
        required property string tabMode
        required property string tabIcon
        required property string tabLabel

        readonly property bool isCurrent: root.mode === tabMode

        Layout.fillWidth: true
        type: isCurrent ? TextButton.Filled : TextButton.Tonal
        icon: tabIcon
        text: tabLabel
        onClicked: root.mode = tabMode
    }
}
