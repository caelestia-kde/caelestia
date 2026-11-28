pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Quickshell
import Quickshell.Widgets
import Caelestia.Config
import qs.components
import qs.components.controls
import qs.components.effects
import qs.services

ListView {
    id: root

    property alias values: valuesModel.values
    property bool first
    property bool last
    property bool allowRemove: true
    property bool allowToggle: true
    property bool allowExpand: false
    property int expandedIndex: -1
    property Component leadingComponent
    // A control that sits between the label and the switch, e.g. a per-row menu.
    property Component trailingComponent
    property Component expandedComponent

    signal itemMoved(from: int, to: int)
    signal itemRemoved(index: int)
    signal itemToggled(index: int, checked: bool)

    function collapse(): void {
        expandedIndex = -1;
    }

    function labelFor(item: var): string {
        return item.label;
    }

    function toggledFor(item: var): bool {
        return false;
    }

    function iconFor(item: var): string {
        return "";
    }

    function subtextFor(item: var): string {
        return "";
    }

    function dampOvershoot(overshoot: real, maxOvershoot: real): real {
        return overshoot / (1 + overshoot / maxOvershoot);
    }

    Layout.fillWidth: true
    implicitHeight: contentHeight

    spacing: Tokens.spacing.extraSmall / 2
    interactive: false

    onCountChanged: {
        if (expandedIndex >= count)
            expandedIndex = -1;
    }

    model: DelegateModel {
        id: visualModel

        model: ScriptModel {
            id: valuesModel
        }

        delegate: ListRow {}
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

    component ListRow: Item {
        id: item

        required property var modelData
        readonly property int itemIndex: DelegateModel.itemsIndex
        readonly property bool isExpanded: !held && (root?.allowExpand ?? false) && (root?.expandedIndex ?? -1) === itemIndex
        property bool held
        property point pressPos
        property int pressIndex
        property real lastMoveY

        property real topRadius: root?.first && itemIndex === 0 ? Tokens.rounding.extraLarge : Tokens.rounding.extraSmall
        property real bottomRadius: root?.last && itemIndex === (root?.count ?? 0) - 1 ? Tokens.rounding.extraLarge : Tokens.rounding.extraSmall
        property real radiusLerpProg

        function lerpRadius(a: real, b: real): real {
            return a + (b - a) * radiusLerpProg;
        }

        anchors.left: root?.contentItem.left
        anchors.right: root?.contentItem.right
        implicitHeight: cardColumn.implicitHeight + cardColumn.anchors.topMargin * 2
        z: held || returnAnim.running ? 1 : 0

        state: held ? "held" : ""

        states: State {
            name: "held"

            PropertyChanges {
                item.radiusLerpProg: 1
                placeholder.opacity: 0.1
                elevation.opacity: 1
                itemBg.color: Colours.palette.m3primaryContainer
                dragIcon.color: Colours.palette.m3onPrimaryContainer
                label.color: Colours.palette.m3onPrimaryContainer
            }
        }

        transitions: Transition {
            Anim {
                properties: "opacity,radiusLerpProg"
                type: Anim.SlowEffects
            }
            PropertyAction {
                properties: "color,inactiveOnColour"
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
            topLeftRadius: item.topRadius
            topRightRadius: item.topRadius
            bottomLeftRadius: item.bottomRadius
            bottomRightRadius: item.bottomRadius
            opacity: 0
        }

        MouseArea {
            id: mouse

            anchors.left: parent.left
            anchors.top: parent.top
            width: Math.max(0, item.width - trailingControls.width - cardColumn.anchors.rightMargin - row.spacing)
            height: row.height + cardColumn.anchors.topMargin * 2
            preventStealing: true
            cursorShape: pressed ? Qt.ClosedHandCursor : Qt.OpenHandCursor

            onPressed: e => {
                root?.collapse();
                returnAnim.stop();
                item.pressPos = Qt.point(e.x, e.y);
                item.pressIndex = item.DelegateModel.itemsIndex;
                item.lastMoveY = item.y;
                item.held = true;

                itemContent.x = Qt.binding(() => {
                    if (!root)
                        return 0;

                    const maxOvershoot = Tokens.padding.extraExtraLarge;
                    const x = mouse.mouseX - item.pressPos.x;
                    return root.dampOvershoot(Math.abs(x), maxOvershoot) * Math.sign(x);
                });
                itemContent.y = Qt.binding(() => {
                    if (!root)
                        return 0;

                    const maxOvershoot = Tokens.padding.extraLarge;
                    const yDiff = item.y - item.lastMoveY;
                    const y = mouse.mouseY - item.pressPos.y - yDiff;
                    const absY = item.mapToItem(root.contentItem, 0, y).y;
                    const maxY = root.implicitHeight - item.implicitHeight;
                    if (absY < 0)
                        return y - absY - root.dampOvershoot(-absY, maxOvershoot);
                    if (absY > maxY)
                        return y - absY + maxY + root.dampOvershoot(absY - maxY, maxOvershoot);
                    return y;
                });
            }

            onPositionChanged: e => {
                if (!root)
                    return;

                item.lastMoveY = item.y;
                const absY = item.mapToItem(root.contentItem, 0, e.y).y;

                const swap = root.itemAt(0, absY);
                if (!swap || swap === item)
                    return;

                const idx = item.DelegateModel.itemsIndex;
                const swapIdx = swap.DelegateModel.itemsIndex;
                visualModel.items.move(idx, swapIdx);
            }

            onReleased: e => {
                itemContent.x = itemContent.x;
                itemContent.y = itemContent.y;
                returnAnim.start();
                item.held = false;

                const idx = item.DelegateModel.itemsIndex;
                if (idx !== item.pressIndex)
                    root?.itemMoved(item.pressIndex, idx);
            }
        }

        Anim {
            id: returnAnim

            target: itemContent
            properties: "x,y"
            to: 0
        }

        Item {
            id: itemContent

            implicitWidth: item.width
            implicitHeight: item.implicitHeight

            Elevation {
                id: elevation

                anchors.fill: parent
                radius: itemBg.radius
                topLeftRadius: itemBg.topLeftRadius
                topRightRadius: itemBg.topRightRadius
                bottomLeftRadius: itemBg.bottomLeftRadius
                bottomRightRadius: itemBg.bottomRightRadius
                level: 3
                opacity: 0
            }

            StyledRect {
                id: itemBg

                anchors.fill: parent
                color: item.isExpanded ? Colours.layer(Colours.palette.m3surfaceContainerHigh, 1) : Colours.tPalette.m3surfaceContainer
                radius: item.lerpRadius(Tokens.rounding.extraSmall, Tokens.rounding.large)
                topLeftRadius: item.lerpRadius(item.topRadius, Tokens.rounding.large)
                topRightRadius: item.lerpRadius(item.topRadius, Tokens.rounding.large)
                bottomLeftRadius: item.lerpRadius(item.bottomRadius, Tokens.rounding.large)
                bottomRightRadius: item.lerpRadius(item.bottomRadius, Tokens.rounding.large)

                Behavior on color {
                    CAnim {}
                }
            }

            MouseArea {
                id: stateLayer

                anchors.fill: parent
                acceptedButtons: Qt.NoButton
                hoverEnabled: true
                cursorShape: mouse.pressed ? Qt.ClosedHandCursor : (mouse.containsMouse ? Qt.OpenHandCursor : Qt.ArrowCursor)

                StyledRect {
                    anchors.fill: parent
                    radius: itemBg.radius
                    topLeftRadius: itemBg.topLeftRadius
                    topRightRadius: itemBg.topRightRadius
                    bottomLeftRadius: itemBg.bottomLeftRadius
                    bottomRightRadius: itemBg.bottomRightRadius
                    color: Colours.palette.m3onSurface
                    opacity: parent.containsMouse && !item.held && !item.isExpanded ? 0.08 : 0

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

                RowLayout {
                    id: row

                    Layout.fillWidth: true
                    spacing: Tokens.spacing.medium

                    MaterialIcon {
                        id: dragIcon

                        text: "drag_indicator"
                        color: Qt.alpha(Colours.palette.m3onSurfaceVariant, (root?.allowToggle ?? false) && !enabledSwitch.checked ? 0.5 : 1)
                        fontStyle: Tokens.font.icon.medium
                    }

                    Loader {
                        id: leadingLoader

                        active: root?.leadingComponent !== null && root?.leadingComponent !== undefined
                        visible: active && status === Loader.Ready
                        Layout.alignment: Qt.AlignVCenter
                        sourceComponent: root?.leadingComponent ?? null

                        onLoaded: {
                            leadingLoader.item.modelData = Qt.binding(() => item.modelData);
                            leadingLoader.item.itemIndex = Qt.binding(() => item.itemIndex);
                        }
                    }

                    IconImage {
                        id: rowIcon

                        readonly property string iconSource: root?.iconFor(item.modelData) ?? ""

                        visible: !leadingLoader.active && iconSource !== ""
                        Layout.alignment: Qt.AlignVCenter
                        implicitSize: Tokens.font.icon.large.pointSize * 1.5
                        source: iconSource
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 0

                        StyledText {
                            id: label

                            Layout.fillWidth: true
                            text: root?.labelFor(item.modelData) ?? ""
                            color: Qt.alpha(Colours.palette.m3onSurface, (root?.allowToggle ?? false) && !enabledSwitch.checked ? 0.5 : 1)
                            elide: Text.ElideRight
                        }

                        StyledText {
                            id: subtext

                            readonly property string value: root?.subtextFor(item.modelData) ?? ""

                            Layout.fillWidth: true
                            visible: value !== ""
                            text: value
                            color: Qt.alpha(Colours.palette.m3onSurfaceVariant, (root?.allowToggle ?? false) && !enabledSwitch.checked ? 0.5 : 1)
                            font: NexusStyle.secondaryFont
                            elide: Text.ElideRight
                        }
                    }

                    RowLayout {
                        id: trailingControls

                        spacing: Tokens.spacing.extraSmall

                        IconButton {
                            visible: root?.allowExpand ?? false
                            type: IconButton.Text
                            isRound: true
                            icon: item.isExpanded ? "expand_less" : "edit"
                            accessibleName: item.isExpanded ? qsTr("Collapse entry") : qsTr("Edit entry")
                            font: Tokens.font.icon.medium
                            label.fill: 0

                            onClicked: {
                                if (root)
                                    root.expandedIndex = item.isExpanded ? -1 : item.itemIndex;
                            }
                        }

                        Loader {
                            id: trailingLoader

                            active: root?.trailingComponent !== null && root?.trailingComponent !== undefined
                            visible: active && status === Loader.Ready
                            sourceComponent: root?.trailingComponent ?? null

                            onLoaded: {
                                trailingLoader.item.modelData = Qt.binding(() => item.modelData);
                                trailingLoader.item.isLast = Qt.binding(() => item.itemIndex === (root?.count ?? 0) - 1);
                            }
                        }

                        StyledSwitch {
                            id: enabledSwitch

                            visible: root?.allowToggle ?? false
                            checked: root?.toggledFor(item.modelData) ?? false
                            font: Tokens.font.icon.medium
                            onToggled: root?.itemToggled(item.itemIndex, checked)
                        }

                        IconButton {
                            visible: root?.allowRemove ?? false
                            type: IconButton.Text
                            isRound: true
                            icon: "delete"
                            accessibleName: qsTr("Remove entry")
                            inactiveOnColour: Colours.palette.m3error
                            font: Tokens.font.icon.medium
                            label.fill: 0

                            onClicked: root?.itemRemoved(item.itemIndex)
                        }
                    }
                }

                Loader {
                    id: expandedLoader

                    Layout.fillWidth: true
                    active: item.isExpanded && root?.expandedComponent !== null && root?.expandedComponent !== undefined
                    visible: active
                    sourceComponent: root?.expandedComponent ?? null

                    onLoaded: {
                        expandedLoader.item.modelData = Qt.binding(() => item.modelData);
                        expandedLoader.item.itemIndex = Qt.binding(() => item.itemIndex);
                    }
                }
            }
        }
    }
}
