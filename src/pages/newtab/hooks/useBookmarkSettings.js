import { useState, useCallback, useEffect } from "react";

const DEFAULT_VISIBLE_ROWS = 2;
const DEFAULT_ICON_TYPE = "favicon"; // "favicon" | "bw-favicon" | "letter"

/**
 * 管理书签与显示设置的 hook
 */
export function useBookmarkSettings() {
    const [visibleRows, setVisibleRows] = useState(() =>
        Number.parseInt(localStorage.getItem("bookmarkVisibleRows") || String(DEFAULT_VISIBLE_ROWS), 10)
    );
    const [isExpanded, setIsExpanded] = useState(false);
    const [iconType, setIconType] = useState(() =>
        localStorage.getItem("bookmarkIconType") || DEFAULT_ICON_TYPE
    );
    const [showBookmarks, setShowBookmarks] = useState(() =>
        localStorage.getItem("showBookmarks") !== "false"
    );
    const [showQuickSites, setShowQuickSites] = useState(() =>
        localStorage.getItem("showQuickSites") !== "false"
    );

    useEffect(() => {
        localStorage.setItem("bookmarkVisibleRows", visibleRows.toString());
    }, [visibleRows]);

    useEffect(() => {
        localStorage.setItem("bookmarkIconType", iconType);
    }, [iconType]);

    useEffect(() => {
        localStorage.setItem("showBookmarks", String(showBookmarks));
    }, [showBookmarks]);

    useEffect(() => {
        localStorage.setItem("showQuickSites", String(showQuickSites));
    }, [showQuickSites]);

    const toggleExpand = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    const cycleVisibleRows = useCallback(() => {
        setVisibleRows((prev) => (prev % 4) + 1);
    }, []);

    const toggleIconType = useCallback(() => {
        setIconType((prev) => {
            if (prev === "favicon") return "bw-favicon";
            if (prev === "bw-favicon") return "letter";
            return "favicon";
        });
    }, []);

    const toggleShowBookmarks = useCallback(() => {
        setShowBookmarks((prev) => !prev);
    }, []);

    const toggleShowQuickSites = useCallback(() => {
        setShowQuickSites((prev) => !prev);
    }, []);

    return {
        visibleRows, isExpanded, toggleExpand, cycleVisibleRows,
        iconType, toggleIconType,
        showBookmarks, toggleShowBookmarks,
        showQuickSites, toggleShowQuickSites,
    };
}
