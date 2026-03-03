import { useState, useRef, useEffect } from "react";

/**
 * 添加/编辑常用网站的毛玻璃模态框
 */
export default function QuickSiteEditor({ site, onSave, onCancel }) {
    const [title, setTitle] = useState(site?.title || "");
    const [url, setUrl] = useState(site?.url || "");
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        const trimmedUrl = url.trim();
        if (!trimmedTitle || !trimmedUrl) return;
        onSave(trimmedTitle, trimmedUrl);
    };

    return (
        <>
            <div className="bookmark-folder-overlay" style={{ zIndex: 299 }} onClick={onCancel} />
            <div
                className="quicksite-editor animate__animated animate__fadeIn animate__faster"
                style={{ zIndex: 300 }}
            >
                <div className="quicksite-editor-header">
                    <span>{site ? "编辑网站" : "添加网站"}</span>
                    <button className="bookmark-folder-close" onClick={onCancel} type="button">
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="quicksite-editor-form">
                    <div className="quicksite-field">
                        <label htmlFor="qs-title">名称</label>
                        <input
                            ref={inputRef}
                            id="qs-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="例如：GitHub"
                            autoComplete="off"
                        />
                    </div>
                    <div className="quicksite-field">
                        <label htmlFor="qs-url">网址</label>
                        <input
                            id="qs-url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="例如：github.com"
                            autoComplete="off"
                        />
                    </div>
                    <div className="quicksite-editor-actions">
                        <button type="button" className="quicksite-btn-cancel" onClick={onCancel}>
                            取消
                        </button>
                        <button type="submit" className="quicksite-btn-save" disabled={!title.trim() || !url.trim()}>
                            保存
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
