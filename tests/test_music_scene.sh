#!/usr/bin/env bash
# suite: fast

set -uo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/helpers.sh"
MUSIC_SCENE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/shell/modules/background/MusicScene.js"

test_shape_is_only_assigned_to_its_screen() {
    command -v node >/dev/null || { skip_test "node is not installed"; return 0; }
    check_js "the circular style should only replace bars on the screen with a shape" "$MUSIC_SCENE" Scene '
const screens = [{name:"primary"}, {name:"external"}];
const widgets = {orb: {type:"shapes"}, clock: {type:"clock"}};
assert.equal(Scene.hasMediaShape(widgets, {"w/orb": {screen:"external"}}, screens, "external"), true);
assert.equal(Scene.hasMediaShape(widgets, {"w/orb": {screen:"external"}}, screens, "primary"), false);
assert.equal(Scene.hasMediaShape({clock: widgets.clock}, {}, screens, "primary"), false);
assert.equal(Scene.hasMediaShape(widgets, {}, [], "primary"), false);
'
}

test_orphaned_and_legacy_widgets_fall_back_to_primary() {
    command -v node >/dev/null || { skip_test "node is not installed"; return 0; }
    check_js "legacy and disconnected screen widgets should follow the primary desktop" "$MUSIC_SCENE" Scene '
const screens = [{name:"primary"}, {name:"external"}];
const widgets = {orb: {type:"shapes"}};
for (const positions of [{}, {"w/orb": {}}, {"w/orb": {screen:"disconnected"}}]) {
  assert.equal(Scene.hasMediaShape(widgets, positions, screens, "primary"), true);
  assert.equal(Scene.hasMediaShape(widgets, positions, screens, "external"), false);
}
'
}

test_renderer_selection_respects_engine_and_desktop() {
    command -v node >/dev/null || { skip_test "node is not installed"; return 0; }
    check_js "the effect should only run with the built-in visualizer and desktop" "$MUSIC_SCENE" Scene '
assert.equal(Scene.usesBuiltIn("plasma", true, true, false), false);
assert.equal(Scene.usesBuiltIn("quickshell", false, true, false), true);
assert.equal(Scene.usesBuiltIn("auto", true, true, false), true);
assert.equal(Scene.usesBuiltIn("auto", false, false, false), true);
assert.equal(Scene.usesBuiltIn("auto", false, true, false), false);
assert.equal(Scene.usesBuiltIn("quickshell", true, false, true), false);
'
}

run_tests
