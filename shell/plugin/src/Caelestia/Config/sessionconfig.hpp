#pragma once

#include <qstring.h>
#include <qstringlist.h>

#include "../Settings/objectnode.hpp"
#include "common.hpp"

namespace caelestia::config {

using Qt::StringLiterals::operator""_s;
using settings::vmap;

class SessionIcons : public settings::ObjectNode {
    CONFIG_NODE(SessionIcons, settings::ObjectNode)

    CONFIG_PROPERTY(QString, logout, u"logout"_s)
    CONFIG_PROPERTY(QString, shutdown, u"power_settings_new"_s)
    CONFIG_PROPERTY(QString, hibernate, u"bedtime"_s)
    CONFIG_PROPERTY(QString, reboot, u"cached"_s)
    CONFIG_PROPERTY(QString, lock, u"lock"_s)
    CONFIG_PROPERTY(QString, changeUser, u"manage_accounts"_s)
};

class SessionCommands : public settings::ObjectNode {
    CONFIG_NODE(SessionCommands, settings::ObjectNode)

    CONFIG_PROPERTY(QStringList, logout, { u"logout"_s })
    CONFIG_PROPERTY(QStringList, shutdown, { u"poweroff"_s })
    CONFIG_PROPERTY(QStringList, hibernate, { u"hibernate"_s })
    CONFIG_PROPERTY(QStringList, reboot, { u"reboot"_s })
    CONFIG_PROPERTY(QStringList, lock, QStringList({ u"loginctl"_s, u"lock-session"_s }))
    CONFIG_PROPERTY(QStringList, changeUser,
        QStringList({ u"sh"_s, u"-c"_s,
            u"qdbus6 org.kde.ksmserver /KSMServer org.kde.KSMServerInterface.openSwitchUser 2>/dev/null || dm-tool switch-to-greeter 2>/dev/null"_s }))

public:
    // Predefined session commands are fixed by the shell and shared with the Launcher;
    // ignore legacy JSON overrides cleanly without triggering unknown-option diagnostics.
    bool syncJson(const QJsonValue&, QList<settings::Diagnostic>&) override { return true; }
};

class SessionEntry : public settings::ObjectNode {
    CONFIG_NODE(SessionEntry, settings::ObjectNode)

    CONFIG_PROPERTY(QString, type, u"button"_s)
    CONFIG_PROPERTY(QString, id, QString())
    CONFIG_PROPERTY(QString, label, QString())
    CONFIG_PROPERTY(QString, icon, QString())
    CONFIG_PROPERTY(QStringList, command, QStringList())
    CONFIG_PROPERTY(QString, media, QString())
};
CONFIG_LIST_TYPE(SessionEntry, SessionEntryList)

class SessionConfig : public settings::ObjectNode {
    CONFIG_NODE(SessionConfig, settings::ObjectNode)

    CONFIG_PROPERTY(bool, enabled, true)
    CONFIG_PROPERTY(int, dragThreshold, 30)
    CONFIG_PROPERTY(bool, vimKeybinds, false)
    CONFIG_SUBOBJECT(SessionIcons, icons)
    CONFIG_SUBOBJECT(SessionCommands, commands)
    CONFIG_LIST(SessionEntryList, entries,
        DEFAULT_ARG({
            vmap({
                { u"type"_s, u"button"_s },
                { u"id"_s, u"logout"_s },
                { u"label"_s, u"Log out"_s },
            }),
            vmap({
                { u"type"_s, u"button"_s },
                { u"id"_s, u"shutdown"_s },
                { u"label"_s, u"Shut down"_s },
            }),
            vmap({
                { u"type"_s, u"media"_s },
                { u"id"_s, u"gif"_s },
                { u"label"_s, u"Session media"_s },
            }),
            vmap({
                { u"type"_s, u"button"_s },
                { u"id"_s, u"hibernate"_s },
                { u"label"_s, u"Hibernate"_s },
            }),
            vmap({
                { u"type"_s, u"button"_s },
                { u"id"_s, u"reboot"_s },
                { u"label"_s, u"Restart"_s },
            }),
        }))
};

} // namespace caelestia::config
