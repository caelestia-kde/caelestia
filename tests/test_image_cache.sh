#!/usr/bin/env bash
# suite: fast

set -uo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/helpers.sh"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHER="$REPO_ROOT/shell/plugin/src/Caelestia/Images/imagecacher.cpp"
PROVIDER="$REPO_ROOT/shell/plugin/src/Caelestia/Images/cachingimageprovider.cpp"
ICON_IMAGE="$REPO_ROOT/shell/components/images/CachingIconImage.qml"
DOCK_ITEM="$REPO_ROOT/shell/components/widgets/DockItem.qml"
DOCK_WRAPPER="$REPO_ROOT/shell/modules/dock/DockWrapper.qml"
BAR_DOCK="$REPO_ROOT/shell/modules/bar/components/Dock.qml"

test_cache_keys_use_cheap_metadata_and_quantised_sizes() {
    assert_file_contains "$CACHER" 'sourceMetadataFor' "cache keys must use file metadata, not file contents"
    assert_file_contains "$CACHER" 'quantisedSize' "requested sizes must be snapped before hashing"
    assert_file_contains "$CACHER" 'v2-%1@%2x%3-%4.png' "cache filenames must carry a version prefix"
    assert_file_not_contains "$CACHER" 'sha256sum' "the whole-file hash must be gone"
}

test_cache_is_bounded_and_tracks_recent_use() {
    assert_file_contains "$CACHER" 'CAELESTIA_IMAGE_CACHE_MB' "the cache budget must be configurable"
    assert_file_contains "$CACHER" 'pruneLocked' "the cache must prune old entries"
    assert_file_contains "$CACHER" 'noteAccess' "cache hits must update the LRU timestamp"
    assert_file_contains "$CACHER" 'minimumFileAgeMs' "freshly written entries must survive pruning"
    assert_file_contains "$CACHER" 'obsolete' "old-format entries must be removed on migration"
    assert_file_contains "$CACHER" 'width() < minCacheExtent' \
        "tiny one-off images must skip disk caching"
}

test_provider_returns_the_exact_requested_size() {
    assert_file_contains "$PROVIDER" 'atRequestedSize' \
        "quantised cache hits must be scaled to the requested size"
    assert_file_contains "$PROVIDER" 'ImageCacher::noteAccess(cachePath)' "cache hits must be marked as used"
}

test_dock_icons_pin_their_source_size() {
    assert_file_contains "$ICON_IMAGE" 'property size cacheSourceSize' \
        "the icon image must accept a fixed source size"
    assert_file_contains "$ICON_IMAGE" 'root.cacheSourceSize.width > 0' \
        "the fixed size must override the live size"
    assert_file_contains "$DOCK_ITEM" 'readonly property int iconCacheExtent' \
        "the dock must request one maximum icon size"
    assert_file_contains "$DOCK_ITEM" 'cacheSourceSize: Qt.size(root.iconCacheExtent, root.iconCacheExtent)' \
        "dock icons must not request a size per frame"
    assert_file_contains "$DOCK_ITEM" 'sourceSize: Qt.size(root.iconCacheExtent, root.iconCacheExtent)' \
        "recoloured dock icons must not resize their source either"
    assert_file_contains "$DOCK_WRAPPER" 'maxMagnification: Config.dockPanel.magnification' \
        "the dock must pass its maximum magnification"
    assert_file_contains "$BAR_DOCK" 'maxMagnification: 1.0' "the bar dock does not magnify"
}

run_tests
