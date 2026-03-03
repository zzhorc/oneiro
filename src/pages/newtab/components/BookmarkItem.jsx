import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * 单个书签图标组件
 * Apple 风格圆角方形 favicon + 名称
 * Tooltip 通过 createPortal 渲染到 body 层，避免被父容器裁切
 */
export default function BookmarkItem({ bookmark, iconType = "favicon" }) {
    const [imgError, setImgError] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const tooltipTimeout = useRef(null);
    const itemRef = useRef(null);

    const handleMouseEnter = useCallback(() => {
        tooltipTimeout.current = setTimeout(() => {
            if (itemRef.current) {
                const rect = itemRef.current.getBoundingClientRect();
                setTooltipPos({
                    top: rect.top - 8,
                    left: rect.left + rect.width / 2,
                });
            }
            setShowTooltip(true);
        }, 400);
    }, []);

    const handleMouseLeave = useCallback(() => {
        clearTimeout(tooltipTimeout.current);
        setShowTooltip(false);
    }, []);

    const firstChar = bookmark.title ? bookmark.title.charAt(0).toUpperCase() : "?";

    const tooltip = showTooltip ? createPortal(
        <div
            className="bookmark-tooltip"
            style={{
                position: "fixed",
                top: `${tooltipPos.top}px`,
                left: `${tooltipPos.left}px`,
                transform: "translate(-50%, -100%)",
                zIndex: 9999,
            }}
        >
            <div className="bookmark-tooltip-title">{bookmark.title}</div>
            <div className="bookmark-tooltip-url">{bookmark.url}</div>
        </div>,
        document.body
    ) : null;

    return (
        <a
            ref={itemRef}
            href={bookmark.url}
            className="bookmark-item group"
            title=""
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="bookmark-icon-wrapper">
                {iconType !== "letter" && !imgError && bookmark.favicon ? (
                    <img
                        src={bookmark.favicon}
                        alt=""
                        className={`bookmark-favicon${iconType === "bw-favicon" ? " bookmark-favicon-bw" : ""}`}
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="bookmark-fallback-icon">
                        {firstChar}
                    </div>
                )}
            </div>
            <span className="bookmark-label">{bookmark.title}</span>
            {tooltip}
        </a>
    );
}
