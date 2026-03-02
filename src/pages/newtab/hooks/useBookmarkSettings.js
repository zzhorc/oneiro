import { useState, useCallback, useEffect } from "react";

const DEFAULT_VISIBLE_ROWS = 2;

/**
 * 管理书签显示设置的 hook
 * @returns {{ visibleRows: number, isExpanded: boolean, toggleExpand: Function, cycleVisibleRows: Function }}
 */
export function useBookmarkSettings() {
    const [visibleRows, setVisibleRows] = useState(() =>
        Number.parseInt(localStorage.getItem("bookmarkVisibleRows") || String(DEFAULT_VISIBLE_ROWS), 10)
    );
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        localStorage.setItem("bookmarkVisibleRows", visibleRows.toString());
    }, [visibleRows]);

    const toggleExpand = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    const cycleVisibleRows = useCallback(() => {
        setVisibleRows((prev) => (prev % 4) + 1);
    }, []);

    return { visibleRows, isExpanded, toggleExpand, cycleVisibleRows };
}
