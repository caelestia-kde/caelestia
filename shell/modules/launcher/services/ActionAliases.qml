pragma Singleton

import qs.utils

Searcher {
    list: Actions.list.filter(action => action.sourceName && action.sourceName !== action.name)
    key: "sourceName"
    useFuzzy: Actions.useFuzzy
}
