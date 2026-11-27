#!/usr/bin/env bash
# suite: fast

set -uo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/helpers.sh"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLTIP_QML="$REPO_ROOT/shell/components/controls/Tooltip.qml"

test_tooltip_measures_unwrapped_width_with_styled_text() {
    assert_file_contains "$TOOLTIP_QML" 'id: tooltipMeasure' \
        "Tooltip should measure unwrapped text with a hidden StyledText item"
    assert_file_contains "$TOOLTIP_QML" 'Math.ceil(tooltipMeasure.implicitWidth)' \
        "Tooltip should ceil the unwrapped StyledText implicitWidth before capping"
    assert_file_contains "$TOOLTIP_QML" 'wrapMode: Text.WordWrap' \
        "Tooltip should keep word wrapping enabled for long hints"
    assert_file_not_contains "$TOOLTIP_QML" 'TextMetrics {' \
        "Tooltip should not size CJK text from a TextMetrics element"
    assert_file_not_contains "$TOOLTIP_QML" 'tooltipMetrics' \
        "Tooltip should not reference tooltipMetrics"
}

test_short_cjk_labels_stay_single_line_and_long_hints_wrap() {
    if ! command -v qml-qt6 >/dev/null 2>&1; then
        skip_test "qml-qt6 not installed"
        return 0
    fi
    if ! command -v python3 >/dev/null 2>&1; then
        skip_test "python3 not installed"
        return 0
    fi

    local out status
    out="$(python3 - <<'PYEOF'
import os
import subprocess
import sys
import tempfile

qml = """//@ pragma NativeTextRendering
import QtQuick

Item {
    width: 800
    height: 600

    property var shortLabels: [
        "电池", "通知", "内核", "固件", "蓝牙", "无线网络", "剪贴板",
        "主机名", "保持唤醒", "未命名", "自定义命令（可选）",
        "Google Sans Flex", "Short English"
    ]
    property var longLabels: [
        "这是一段非常非常非常长的中文悬停提示文本用于测试在超出最大宽度上限之后是否仍然能够正常自动换行显示",
        "This is a very long English tooltip message that definitely exceeds the 360px cap and should wrap across multiple lines cleanly."
    ]
    property var multiLineLabels: [
        "电池\\n85%",
        "第一行\\n第二行"
    ]
    property int failures: 0
    property var errors: []

    Component {
        id: probeComp
        Item {
            property string textValue: ""
            property string fontFamily: "Google Sans"
            readonly property real maxContentWidth: 360
            readonly property real contentWidth: Math.min(Math.ceil(measure.implicitWidth), maxContentWidth)
            readonly property int lineCount: shown.lineCount
            readonly property real measuredWidth: measure.implicitWidth
            readonly property real shownWidth: shown.width

            Text {
                id: measure
                visible: false
                renderType: Text.NativeRendering
                textFormat: Text.PlainText
                font.family: parent.fontFamily
                font.pointSize: 10
                text: parent.textValue
            }
            Text {
                id: shown
                renderType: Text.NativeRendering
                textFormat: Text.PlainText
                width: parent.contentWidth
                wrapMode: Text.WordWrap
                font.family: parent.fontFamily
                font.pointSize: 10
                text: parent.textValue
            }
        }
    }

    Timer {
        interval: 20
        running: true
        onTriggered: {
            const families = ["Google Sans", "Rubik"];
            for (const fam of families) {
                for (const s of shortLabels) {
                    const item = probeComp.createObject(null, { textValue: s, fontFamily: fam });
                    if (item.lineCount !== 1) {
                        failures++;
                        errors.push(`short(${fam}): "${s}" wrapped to ${item.lineCount} lines (w=${item.shownWidth}, meas=${item.measuredWidth})`);
                    }
                    item.destroy();
                }
                for (const s of longLabels) {
                    const item = probeComp.createObject(null, { textValue: s, fontFamily: fam });
                    if (item.lineCount <= 1 || item.shownWidth > 360) {
                        failures++;
                        errors.push(`long(${fam}): "${s.slice(0, 16)}" lines=${item.lineCount} w=${item.shownWidth}`);
                    }
                    item.destroy();
                }
                for (const s of multiLineLabels) {
                    const item = probeComp.createObject(null, { textValue: s, fontFamily: fam });
                    if (item.lineCount !== 2) {
                        failures++;
                        errors.push(`multi(${fam}): expected 2 lines, got ${item.lineCount}`);
                    }
                    item.destroy();
                }
            }
            if (failures > 0) {
                console.error("FAILURES:", JSON.stringify(errors));
                Qt.exit(1);
            } else {
                console.log("OK");
                Qt.quit();
            }
        }
    }
}
"""

with tempfile.TemporaryDirectory() as d:
    path = os.path.join(d, "tooltip_probe.qml")
    with open(path, "w", encoding="utf-8") as f:
        f.write(qml)
    for dpr in ("1", "2"):
        env = {**os.environ, "QT_QPA_PLATFORM": "offscreen", "QT_SCALE_FACTOR": dpr}
        proc = subprocess.run(["qml-qt6", path], env=env, capture_output=True, text=True, timeout=15)
        if proc.returncode != 0:
            print(f"DPR={dpr} rc={proc.returncode}\n{proc.stdout}\n{proc.stderr}")
            sys.exit(1)
print("ok")
PYEOF
    2>&1)"
    status=$?
    assert_status 0 "$status" "QML runtime tooltip width checks should pass ($out)"
}

run_tests
