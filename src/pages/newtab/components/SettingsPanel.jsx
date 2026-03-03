import { useState, useCallback, useRef, useEffect } from "react";
import {
  IoSettingsOutline as SettingsIcon,
  IoMoonOutline as MoonIcon,
  IoSunnyOutline as SunIcon,
  IoImageOutline as ImageIcon,
  IoTextOutline as TextIcon,
  IoContrastOutline as BwIcon,
  IoBookmarksOutline as BookmarkIcon,
  IoGlobeOutline as GlobeIcon,
} from "react-icons/io5";
import { MdTimelapse as SyncIcon } from "react-icons/md";
import { BiFontFamily as FontIcon } from "react-icons/bi";

/**
 * 统一设置面板
 * 左下角齿轮按钮 → 分组式毛玻璃菜单
 */
export default function SettingsPanel({
  theme,
  onThemeToggle,
  onFontToggle,
  visibleRows,
  onRowsCycle,
  iconType,
  onIconTypeToggle,
  showBookmarks,
  onToggleBookmarks,
  showQuickSites,
  onToggleQuickSites,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const themeLabel = theme === "sync" ? "跟随系统" : theme === "dark" ? "深色" : "浅色";
  const iconTypeLabel = iconType === "favicon" ? "彩色" : iconType === "bw-favicon" ? "黑白" : "首字";

  return (
    <div ref={panelRef} className="settings-container">
      <button
        className="settings-trigger"
        onClick={togglePanel}
        type="button"
        title="设置"
      >
        <SettingsIcon className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="settings-popover animate__animated animate__fadeIn animate__faster">
          {/* 外观 */}
          <div className="settings-group-title">外观</div>

          <button className="settings-row" onClick={onThemeToggle} type="button">
            <span className="settings-row-icon">
              {theme === "light" && <SunIcon className="w-5 h-5" />}
              {theme === "dark" && <MoonIcon className="w-5 h-5" />}
              {theme === "sync" && <SyncIcon className="w-5 h-5" />}
            </span>
            <span className="settings-row-label">主题</span>
            <span className="settings-row-value">{themeLabel}</span>
          </button>

          <button className="settings-row" onClick={onFontToggle} type="button">
            <span className="settings-row-icon">
              <FontIcon className="w-5 h-5" />
            </span>
            <span className="settings-row-label">字体</span>
            <span className="settings-row-value">切换</span>
          </button>

          <button className="settings-row" onClick={onIconTypeToggle} type="button">
            <span className="settings-row-icon">
              {iconType === "favicon" ? (
                <ImageIcon className="w-5 h-5" />
              ) : iconType === "bw-favicon" ? (
                <BwIcon className="w-5 h-5" />
              ) : (
                <TextIcon className="w-5 h-5" />
              )}
            </span>
            <span className="settings-row-label">图标风格</span>
            <span className="settings-row-value">{iconTypeLabel}</span>
          </button>

          {/* 分隔线 */}
          <div className="settings-divider" />

          {/* 显示 */}
          <div className="settings-group-title">显示</div>

          <button className="settings-row" onClick={onToggleBookmarks} type="button">
            <span className="settings-row-icon">
              <BookmarkIcon className="w-5 h-5" />
            </span>
            <span className="settings-row-label">书签</span>
            <span className={`settings-row-toggle ${showBookmarks ? "is-on" : ""}`}>
              {showBookmarks ? "开" : "关"}
            </span>
          </button>

          <button className="settings-row" onClick={onToggleQuickSites} type="button">
            <span className="settings-row-icon">
              <GlobeIcon className="w-5 h-5" />
            </span>
            <span className="settings-row-label">常用网站</span>
            <span className={`settings-row-toggle ${showQuickSites ? "is-on" : ""}`}>
              {showQuickSites ? "开" : "关"}
            </span>
          </button>

          {showBookmarks && (
            <button className="settings-row" onClick={onRowsCycle} type="button">
              <span className="settings-row-icon">
                <span className="settings-rows-badge">{visibleRows}</span>
              </span>
              <span className="settings-row-label">书签行数</span>
              <span className="settings-row-value">{visibleRows} 行</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}