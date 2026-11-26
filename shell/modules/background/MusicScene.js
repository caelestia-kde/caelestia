.pragma library

// Follow the desktop's screen assignment, including widgets from older layouts
// and widgets whose original monitor is no longer connected.
function hasMediaShape(widgets, positions, screens, screenName) {
    if (!screenName || !screens.length)
        return false;
    const primary = screens[0].name;
    const isPrimary = primary === screenName;
    for (const id of Object.keys(widgets)) {
        if (widgets[id]?.type !== "shapes")
            continue;
        const position = positions["w/" + id];
        if (!position || !position.screen) {
            if (isPrimary)
                return true;
        } else if (position.screen === screenName || (isPrimary && !screens.some(screen => screen.name === position.screen))) {
            return true;
        }
    }
    return false;
}

function usesBuiltIn(engine, wallpaperEnabled, hasPlasmaVisualizer, desktopDisabled) {
    return !desktopDisabled && (engine === "quickshell" || (engine !== "plasma" && (wallpaperEnabled || !hasPlasmaVisualizer)));
}
