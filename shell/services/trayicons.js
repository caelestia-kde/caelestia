.pragma library

// Tray icon identity and ordering. Per-icon settings are keyed by a value that
// survives the notifier id changing between launches, which is what makes a pinned
// or hidden icon stay that way after the app restarts.
//
// Kept free of QML types so the rules can be tested on their own; TrayRegistry.qml
// owns the state.

function pidOf(id) {
    const match = /^(\d+)-\d+$/.exec(id);
    return match ? match[1] : "";
}

// Chromium and Electron register every tray icon in a process under a sequential
// `chrome_status_icon_<n>` id with no pid and no theme icon name, so multiple apps
// collide on the same id unless resolved to their desktop application.
function isGenericId(id) {
    return /^chrome_status_icon_\d+$/.test(String(id ?? ""));
}

// A notifier that ships no theme icon (a pixmap) names nothing stable, so it keeps
// its id as its key.
function themeIconName(icon) {
    if (!icon || !icon.startsWith("image://icon/"))
        return "";
    const name = icon.slice("image://icon/".length);
    return name && !name.includes("/") ? name : "";
}

function prettify(name) {
    return String(name ?? "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

// `comm` is the process behind the notifier, when it is known; `app` is the desktop
// entry id resolved for generic Chromium/Electron notifiers that carry neither a pid
// nor a theme icon name.
function keyOf(id, icon, comm, app) {
    if (comm)
        return `proc:${comm}`;
    const name = themeIconName(icon);
    if (name)
        return `icon:${name}`;
    const appId = String(app ?? "").replace(/\.desktop$/i, "").trim();
    return appId ? `app:${appId}` : id;
}

function labelOf(key) {
    const value = String(key ?? "");
    return /^(proc|icon|app):/.test(value) ? prettify(value.replace(/^(proc|icon|app):/, "")) : value;
}

function iconNameOf(key) {
    return String(key ?? "").replace(/^(proc|icon|app):/, "");
}

// Candidate application names derived from a tray item's title and tooltip, ordered from
// most specific to broadest so desktop-entry lookup can still recognize apps that append
// unread counts or status text (e.g. "Discord (3)", "Slack - Workspace") without splitting
// hyphenated names like "Cachy-Update".
function appLabelCandidates(title, tooltipTitle) {
    const out = [];
    const push = value => {
        const cleaned = readableTitle(String(value ?? "").trim());
        if (!cleaned || isGenericId(cleaned) || out.includes(cleaned))
            return;
        out.push(cleaned);
    };

    for (const raw of [title, tooltipTitle]) {
        const base = String(raw ?? "").trim();
        if (!base)
            continue;
        push(base);
        const withoutBadge = base.replace(/\s*[\(\[]\d+\+?[\)\]]\s*$/, "").trim();
        if (withoutBadge !== base)
            push(withoutBadge);
        const sep = withoutBadge.search(/\s+(?:-|—|–|\|)\s+|:\s+/);
        if (sep > 0)
            push(withoutBadge.slice(0, sep));
    }
    return out;
}

// A title read by a person names the app ("Cachy-Update"); a notifier id or a bus name
// names the plumbing, and the alias the icon name gives is longer than either.
function readableTitle(title) {
    const value = String(title ?? "");
    if (value.length === 0)
        return "";
    if (/^\d+-\d+$/.test(value) || value.startsWith("org.kde.StatusNotifierItem"))
        return "";
    return value;
}

// hidden wins over visible: an icon in both lists stays hidden.
function stateOf(key, hidden, visible) {
    if (hidden.includes(key))
        return "hidden";
    if (visible.includes(key))
        return "visible";
    return "collapsed";
}

// Whether a list already says what the next one would: writing it again only costs a
// config write and a redraw of everything that reads it.
function sameList(a, b) {
    const left = a ?? [];
    const right = b ?? [];
    if (left.length !== right.length)
        return false;
    for (let i = 0; i < left.length; i++) {
        if (left[i] !== right[i])
            return false;
    }
    return true;
}

// Rows carry a `key`. Listed keys come first, in the order the list gives them;
// everything else follows in the order it was handed in.
function ordered(rows, order) {
    if (order.length === 0)
        return rows;
    const rank = key => {
        const index = order.indexOf(key);
        return index < 0 ? order.length : index;
    };
    return rows.map((row, index) => ({
            row,
            index
        })).sort((a, b) => rank(a.row.key) - rank(b.row.key) || a.index - b.index).map(entry => entry.row);
}
