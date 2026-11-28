#!/usr/bin/env bash
# suite: fast
# Verify predefined session commands, default entries, dynamic drawer rendering, and Nexus editor.

set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/helpers.sh"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_HPP="$REPO_ROOT/shell/plugin/src/Caelestia/Config/sessionconfig.hpp"
SESSION_CONTENT="$REPO_ROOT/shell/modules/session/Content.qml"
LAUNCHER_CONTENT="$REPO_ROOT/shell/modules/launcher/Content.qml"
MEDIA_VIEW="$REPO_ROOT/shell/components/images/MediaView.qml"
SESSION_PAGE="$REPO_ROOT/shell/modules/nexus/pages/SessionPage.qml"
ENTRY_LIST="$REPO_ROOT/shell/modules/nexus/common/SessionEntryList.qml"
ADD_BTN="$REPO_ROOT/shell/modules/nexus/common/AddSessionEntryButton.qml"

test_predefined_session_commands_and_default_five_entries() {
    for key in logout reboot shutdown sleep hibernate lock changeUser; do
        assert_file_contains "$CONFIG_HPP" "$key" \
            "SessionConfig defines predefined command/icon key $key"
    done

    assert_file_contains "$CONFIG_HPP" "CONFIG_LIST(SessionEntryList, entries" \
        "SessionConfig exposes dynamic entries list"
    assert_file_contains "$CONFIG_HPP" '{ u"id"_s, u"sleep"_s }' \
        "default session entries use sleep instead of hibernate"
    assert_file_contains "$CONFIG_HPP" '{ u"id"_s, u"gif"_s }' \
        "default session entries include the media slot"
    assert_file_contains "$CONFIG_HPP" "bool syncJson(" \
        "SessionCommands preserves predefined shell commands against legacy JSON overrides"
}

test_launcher_uses_session_commands() {
    assert_file_contains "$LAUNCHER_CONTENT" "Config.session.commands.logout" \
        "Launcher Log Out action uses Config.session.commands.logout"
    assert_file_contains "$LAUNCHER_CONTENT" "Config.session.commands.sleep" \
        "Launcher Sleep action uses Config.session.commands.sleep"
    assert_file_contains "$LAUNCHER_CONTENT" "Config.session.commands.reboot" \
        "Launcher Restart action uses Config.session.commands.reboot"
    assert_file_contains "$LAUNCHER_CONTENT" "Config.session.commands.shutdown" \
        "Launcher Shut Down action uses Config.session.commands.shutdown"
}

test_session_drawer_renders_dynamic_entries_and_all_media() {
    assert_file_contains "$SESSION_CONTENT" "model: Config.session.entries.values" \
        "Session drawer repeats over dynamic Config.session.entries"
    assert_file_contains "$SESSION_CONTENT" "MediaView" \
        "Session drawer renders media slots via MediaView"
    assert_file_contains "$MEDIA_VIEW" "Images.isVideo" \
        "MediaView detects video files"
    assert_file_contains "$MEDIA_VIEW" "MediaPlayer" \
        "MediaView supports video playback via lazy Loader"
}

test_nexus_session_page_supports_rearrange_media_and_add_remove() {
    assert_file_contains "$SESSION_PAGE" "GlobalConfig.session.entries.move(from, to)" \
        "SessionPage supports rearranging entries"
    assert_file_contains "$SESSION_PAGE" "GlobalConfig.session.entries.remove(index)" \
        "SessionPage supports removing entries"
    assert_file_contains "$SESSION_PAGE" "GlobalConfig.session.entries.insert" \
        "SessionPage supports adding predefined, custom, and media entries"
    assert_file_contains "$ENTRY_LIST" "visible: !card.isPredefined" \
        "predefined entry commands stay locked while custom entry commands are editable"
    assert_file_contains "$ENTRY_LIST" "Images.validImageExtensions.concat(Images.validVideoExtensions)" \
        "media picker accepts all supported image and video extensions"
    assert_file_contains "$ADD_BTN" "DialogRowButton" \
        "AddSessionEntryButton uses Nexus DialogRowButton"
}

run_tests
