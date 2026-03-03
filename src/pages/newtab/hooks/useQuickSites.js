import { useState, useCallback, useEffect } from "react";
import { browser } from "wxt/browser";

const STORAGE_KEY = "quickSites";

/**
 * 获取常用网站的 favicon URL（与书签一致）
 */
function getSiteFavicon(pageUrl) {
    try {
        new URL(pageUrl);
        const faviconBase = browser.runtime.getURL("_favicon/");
        return `${faviconBase}?pageUrl=${encodeURIComponent(pageUrl)}&size=128`;
    } catch {
        return "";
    }
}

/**
 * 生成简短唯一 ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * 管理常用网站的 hook
 * @returns {{ sites: Array, addSite: Function, editSite: Function, removeSite: Function }}
 */
export function useQuickSites() {
    const [sites, setSites] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
    }, [sites]);

    const addSite = useCallback((title, url) => {
        const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
        const newSite = {
            id: generateId(),
            title,
            url: normalizedUrl,
            favicon: getSiteFavicon(normalizedUrl),
        };
        setSites((prev) => [...prev, newSite]);
    }, []);

    const editSite = useCallback((id, title, url) => {
        const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
        setSites((prev) =>
            prev.map((site) =>
                site.id === id
                    ? { ...site, title, url: normalizedUrl, favicon: getSiteFavicon(normalizedUrl) }
                    : site
            )
        );
    }, []);

    const removeSite = useCallback((id) => {
        setSites((prev) => prev.filter((site) => site.id !== id));
    }, []);

    return { sites, addSite, editSite, removeSite };
}
