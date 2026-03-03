import { useState, useEffect, useCallback } from "react";
import { browser } from "wxt/browser";

/**
 * @typedef {Object} BookmarkItem
 * @property {string} id
 * @property {string} title
 * @property {string} url
 * @property {string} favicon
 */

/**
 * @typedef {Object} BookmarkFolder
 * @property {string} id
 * @property {string} title
 * @property {Array<BookmarkItem|BookmarkFolder>} children
 */

const BOOKMARKS_BAR_ID = "1";

/**
 * 获取 favicon URL
 * @param {string} pageUrl
 * @returns {string}
 */
function getFaviconUrl(pageUrl) {
    try {
        new URL(pageUrl); // validate URL
        const faviconBase = browser.runtime.getURL("_favicon/");
        return `${faviconBase}?pageUrl=${encodeURIComponent(pageUrl)}&size=128`;
    } catch {
        return "";
    }
}

/**
 * 递归解析书签树
 * @param {Array} nodes - chrome.bookmarks API 返回的节点
 * @returns {Array<BookmarkItem|BookmarkFolder>}
 */
function parseBookmarkNodes(nodes) {
    if (!nodes) return [];
    return nodes.map((node) => {
        if (node.children) {
            return {
                id: node.id,
                title: node.title,
                children: parseBookmarkNodes(node.children),
            };
        }
        return {
            id: node.id,
            title: node.title,
            url: node.url,
            favicon: getFaviconUrl(node.url),
        };
    });
}

/**
 * 读取书签栏并实时同步的 hook
 * @returns {{ bookmarks: Array, loading: boolean }}
 */
export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadBookmarks = useCallback(async () => {
        try {
            const tree = await browser.bookmarks.getSubTree(BOOKMARKS_BAR_ID);
            if (tree && tree[0] && tree[0].children) {
                setBookmarks(parseBookmarkNodes(tree[0].children));
            }
        } catch (error) {
            console.error("读取书签失败:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBookmarks();

        // 监听书签变化，实时同步
        const onChange = () => loadBookmarks();

        browser.bookmarks.onCreated.addListener(onChange);
        browser.bookmarks.onRemoved.addListener(onChange);
        browser.bookmarks.onChanged.addListener(onChange);
        browser.bookmarks.onMoved.addListener(onChange);

        return () => {
            browser.bookmarks.onCreated.removeListener(onChange);
            browser.bookmarks.onRemoved.removeListener(onChange);
            browser.bookmarks.onChanged.removeListener(onChange);
            browser.bookmarks.onMoved.removeListener(onChange);
        };
    }, [loadBookmarks]);

    return { bookmarks, loading };
}
