#!/usr/bin/env bash
# suite: fast

set -uo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/helpers.sh"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PINYIN_JS="$REPO_ROOT/shell/utils/scripts/pinyin.js"
SEARCHER="$REPO_ROOT/shell/utils/Searcher.qml"
PAGE_REGISTRY="$REPO_ROOT/shell/modules/nexus/PageRegistry.qml"
WINDOWS="$REPO_ROOT/shell/modules/launcher/services/Windows.qml"
APP_LIST="$REPO_ROOT/shell/modules/launcher/AppList.qml"
NOTIFS="$REPO_ROOT/shell/services/Notifs.qml"

check_pinyin() { check_js "$1" "$PINYIN_JS" Pinyin "$2"; }

test_full_pinyin_and_initials() {
    check_pinyin "full pinyin and initials match Chinese labels" '
assert.strictEqual(Pinyin.matches("微信", "weixin"), true);
assert.strictEqual(Pinyin.matches("微信", "wx"), true);
assert.strictEqual(Pinyin.matches("设置", "shezhi"), true);
assert.strictEqual(Pinyin.matches("设置", "sz"), true);
assert.strictEqual(Pinyin.matches("重启", "chongqi"), true);
assert.strictEqual(Pinyin.matches("重启", "cq"), true);
assert.strictEqual(Pinyin.matches("计算器", "jisuanqi"), true);
assert.strictEqual(Pinyin.matches("计算器", "jsq"), true);
assert.strictEqual(Pinyin.matches("系统设置", "xtsz"), true);
'
}

test_syllable_prefixes_and_double_initials() {
    check_pinyin "syllable prefixes and zh/ch/sh double initials match" '
assert.strictEqual(Pinyin.matches("微信", "weix"), true);
assert.strictEqual(Pinyin.matches("微信", "weixi"), true);
assert.strictEqual(Pinyin.matches("设置", "shez"), true);
assert.strictEqual(Pinyin.matches("设置", "shezh"), true);
assert.strictEqual(Pinyin.matches("设置", "shzh"), true);
assert.strictEqual(Pinyin.matches("重启", "chq"), true);
assert.strictEqual(Pinyin.matches("重启", "chongq"), true);
'
}

test_mixed_hanzi_pinyin_and_multi_token() {
    check_pinyin "mixed Hanzi/Pinyin/ASCII and multi-token queries match" '
assert.strictEqual(Pinyin.matches("微信", "w信"), true);
assert.strictEqual(Pinyin.matches("微信", "微x"), true);
assert.strictEqual(Pinyin.matches("系统设置", "xt设置"), true);
assert.strictEqual(Pinyin.matches("QQ邮箱提醒", "qqyx"), true);
assert.strictEqual(Pinyin.matches("WeChat 微信", "wx 微信"), true);
assert.strictEqual(Pinyin.matches("系统设置", "xt sz"), true);
assert.strictEqual(Pinyin.matches("妈妈 [转账] 待你收款", "mm zz"), true);
'
}

test_polyphones_traditional_and_v_u() {
    check_pinyin "polyphones, Traditional Chinese, and v/u tolerance match" '
assert.strictEqual(Pinyin.matches("重启", "chongqi"), true);
assert.strictEqual(Pinyin.matches("重量", "zhongliang"), true);
assert.strictEqual(Pinyin.matches("音乐", "yinyue"), true);
assert.strictEqual(Pinyin.matches("快乐", "kuaile"), true);
assert.strictEqual(Pinyin.matches("调整", "tiaozheng"), true);
assert.strictEqual(Pinyin.matches("调度", "diaodu"), true);
assert.strictEqual(Pinyin.matches("行业", "hangye"), true);
assert.strictEqual(Pinyin.matches("运行", "yunxing"), true);
assert.strictEqual(Pinyin.matches("設定", "sheding"), true);
assert.strictEqual(Pinyin.matches("設定", "sd"), true);
assert.strictEqual(Pinyin.matches("設置", "shezhi"), true);
assert.strictEqual(Pinyin.matches("音樂", "yinyue"), true);
assert.strictEqual(Pinyin.matches("绿色", "lvse"), true);
assert.strictEqual(Pinyin.matches("绿色", "luse"), true);
assert.strictEqual(Pinyin.matches("女", "nv"), true);
assert.strictEqual(Pinyin.matches("女", "nu"), true);
'
}

test_rejects_cross_syllable_false_positives() {
    check_pinyin "cross-syllable substrings do not produce false positives" '
assert.strictEqual(Pinyin.matches("微信", "en"), false);
assert.strictEqual(Pinyin.matches("微信", "in"), false);
assert.strictEqual(Pinyin.matches("微信", "ex"), false);
assert.strictEqual(Pinyin.matches("系统", "ig"), false);
assert.strictEqual(Pinyin.matches("系统", "ong"), false);
assert.strictEqual(Pinyin.matches("Firefox", "fx"), false, "non-CJK text skips pinyin matching");
'
}

test_merge_results_ranking_and_non_cjk_passthrough() {
    check_pinyin "mergeResults prioritizes literal and strong pinyin hits over scattered fuzzy hits" '
const apps = [
    { name: "Wayland to X11" },
    { name: "Firefox" },
    { name: "微信" },
    { name: "Settings" },
    { name: "设置" }
];
const wxMerged = Pinyin.mergeResults(apps, [apps[0]], x => x.name, "wx");
assert.deepStrictEqual(wxMerged.map(x => x.name), ["微信", "Wayland to X11"]);

const settMerged = Pinyin.mergeResults(apps, [apps[3]], x => x.name, "sett");
assert.deepStrictEqual(settMerged.map(x => x.name), ["Settings"]);

const nonCjk = [{ name: "Firefox" }, { name: "Wayland to X11" }];
const baseOnly = [nonCjk[0]];
assert.strictEqual(Pinyin.mergeResults(nonCjk, baseOnly, x => x.name, "fi"), baseOnly);
'
}

test_wired_into_all_six_search_surfaces() {
    assert_file_contains "$SEARCHER" 'Pinyin.mergeResults' "Searcher.qml uses Pinyin.mergeResults"
    assert_file_contains "$PAGE_REGISTRY" 'Pinyin.mergeResults(allPages' "PageRegistry.fuzzyPages uses Pinyin.mergeResults"
    assert_file_contains "$PAGE_REGISTRY" 'Pinyin.mergeResults(searchIndex' "PageRegistry.fuzzyEntries uses Pinyin.mergeResults"
    assert_file_contains "$WINDOWS" 'Pinyin.matches(w.title, search)' "Windows.qml matches titles via Pinyin"
    assert_file_contains "$APP_LIST" 'Pinyin.matches(item.preview, q)' "AppList.qml matches clipboard previews via Pinyin"
    assert_file_contains "$NOTIFS" 'Pinyin.matches(' "Notifs.qml matches notifications via Pinyin"
}

run_tests
