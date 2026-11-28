pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Caelestia.Config
import qs.components
import qs.services
import qs.modules.nexus.common

PageBase {
    id: root

    readonly property var predefinedIds: ["logout", "reboot", "shutdown", "sleep", "hibernate", "lock", "changeUser"]
    readonly property var defaultLabels: ({
        logout: qsTr("Log out"),
        reboot: qsTr("Restart"),
        shutdown: qsTr("Shut down"),
        sleep: qsTr("Sleep"),
        hibernate: qsTr("Hibernate"),
        lock: qsTr("Lock"),
        changeUser: qsTr("Switch user")
    })
    readonly property var predefinedItems: {
        const present = (Config.session.entries.values ?? []).filter(e => e?.id).map(e => e.id);
        return root.predefinedIds.filter(id => !present.includes(id)).map(id => ({
            id: id,
            label: root.defaultLabels[id],
            icon: Config.session.icons[id] || "help_outline",
            commandText: (Config.session.commands[id] ?? []).join(" ")
        }));
    }
    readonly property bool hasMediaEntry: (Config.session.entries.values ?? []).some(e => e?.type === "media")

    function commandList(text: string): var {
        return text.trim().split(/\s+/).filter(s => s.length > 0);
    }

    title: qsTr("Session")

    ColumnLayout {
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        width: root.cappedWidth
        spacing: Tokens.spacing.extraSmall / 2

        SectionHeader {
            first: true
            text: qsTr("General")
        }

        ToggleRow {
            first: true
            Layout.fillWidth: true
            text: qsTr("Enabled")
            subtext: qsTr("Show the session (power) menu")
            reset: ({ node: GlobalConfig.session, setting: "enabled" })
            checked: Config.session.enabled
            onToggled: GlobalConfig.session.enabled = checked
        }

        ToggleRow {
            Layout.fillWidth: true
            text: qsTr("Vim keybinds")
            subtext: qsTr("Navigate the session menu with hjkl")
            reset: ({ node: GlobalConfig.session, setting: "vimKeybinds" })
            checked: Config.session.vimKeybinds
            onToggled: GlobalConfig.session.vimKeybinds = checked
        }

        StepperRow {
            last: !root.hasMediaEntry
            label: qsTr("Drag threshold")
            subtext: qsTr("Pixels to drag before the menu moves")
            reset: ({ node: GlobalConfig.session, setting: "dragThreshold" })
            value: Config.session.dragThreshold
            from: 10
            to: 200
            stepSize: 5
            onMoved: v => GlobalConfig.session.dragThreshold = v
        }

        StepperRow {
            visible: root.hasMediaEntry
            last: true
            label: qsTr("Media speed")
            subtext: qsTr("Playback speed multiplier for animated session media")
            reset: ({ node: GlobalConfig.general, setting: "sessionGifSpeed" })
            value: Config.general.sessionGifSpeed
            from: 0.2
            to: 2.5
            stepSize: 0.1
            onMoved: v => GlobalConfig.general.sessionGifSpeed = v
        }

        SectionHeaderAction {
            text: qsTr("Menu entries")
            actionText: qsTr("Reset defaults")
            onActionClicked: resetDialog.open()
        }

        StyledText {
            Layout.fillWidth: true
            Layout.leftMargin: Tokens.padding.small
            Layout.rightMargin: Tokens.padding.small
            Layout.bottomMargin: Tokens.spacing.extraSmall
            text: qsTr("Drag entries to rearrange the session menu. Predefined actions keep their shared Launcher commands; custom entries and media are fully configurable.")
            color: Colours.palette.m3onSurfaceVariant
            font: NexusStyle.secondaryFont
            wrapMode: Text.Wrap
        }

        SessionEntryList {
            id: entryList

            first: true
            last: false
            entries: Config.session.entries.values
            predefinedIds: root.predefinedIds
            defaultLabels: root.defaultLabels
            mediaSpeed: Config.general.sessionGifSpeed

            onEntryMoved: (from, to) => {
                GlobalConfig.session.entries.move(from, to);
                GlobalConfig.save();
            }

            onEntryRemoved: index => {
                GlobalConfig.session.entries.remove(index);
                GlobalConfig.save();
            }

            onEntryLabelChanged: (index, label) => {
                const entry = GlobalConfig.session.entries.at(index);
                if (entry) {
                    entry.label = label;
                    GlobalConfig.save();
                }
            }

            onEntryIconChanged: (index, icon) => {
                const entry = GlobalConfig.session.entries.at(index);
                if (entry) {
                    entry.icon = icon;
                    GlobalConfig.save();
                }
            }

            onEntryCommandChanged: (index, command) => {
                const entry = GlobalConfig.session.entries.at(index);
                if (entry && (!entry.id || !root.predefinedIds.includes(entry.id))) {
                    entry.command = command;
                    GlobalConfig.save();
                }
            }

            onEntryMediaChanged: (index, media) => {
                const entry = GlobalConfig.session.entries.at(index);
                if (entry) {
                    entry.media = media;
                    GlobalConfig.save();
                }
            }
        }

        AddSessionEntryButton {
            rootParent: root.flickable
            predefinedItems: root.predefinedItems

            onAddPredefined: id => {
                GlobalConfig.session.entries.insert({
                    type: "button",
                    id: id,
                    label: root.defaultLabels[id] ?? ""
                });
                GlobalConfig.save();
            }

            onAddCustom: (label, icon, command) => {
                GlobalConfig.session.entries.insert({
                    type: "button",
                    id: "",
                    label: label,
                    icon: icon,
                    command: root.commandList(command)
                });
                GlobalConfig.save();
            }

            onAddMedia: (label, mediaPath) => {
                GlobalConfig.session.entries.insert({
                    type: "media",
                    id: mediaPath === "" ? "gif" : "",
                    label: label,
                    media: mediaPath
                });
                GlobalConfig.save();
            }
        }

        NexusDialog {
            id: resetDialog

            title: qsTr("Reset session entries?")
            message: qsTr("This will restore the default 5 session menu entries and their original order.")
            confirmText: qsTr("Reset")
            destructive: true
            onConfirmed: {
                entryList.collapse();
                const session = GlobalConfig.session;
                session.resetOption("entries");
                session.resetOption("icons");
                GlobalConfig.save();
            }
        }
    }
}
