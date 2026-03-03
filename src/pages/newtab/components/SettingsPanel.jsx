import { useState, useCallback, useRef, useEffect } from "react";
import {
  IoSettingsOutline as SettingsIcon,
  IoMoonOutline as MoonIcon,
  IoSunnyOutline as SunIcon,
  IoImageOutline as ImageIcon,
  IoTextOutline as TextIcon,
  IoContrastOutline as BwIcon,
} from "react-icons/io5";
import { MdTimelapse as SyncIcon } from "react-icons/md";
import { BiFontFamily as FontIcon } from "react-icons/bi";

/**
 * 统一设置面板
 * 左下角齿轮按钮，点击弹出毛玻璃菜单
 */
export default function SettingsPanel({
  theme,
  onThemeToggle,
  onFontToggle,
  visibleRows,
  onRowsCycle,
  iconType,
  onIconTypeToggle,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // 点击面板外部关闭
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
  const iconTypeLabel = iconType === "favicon" ? "彩色图标" : iconType === "bw-favicon" ? "黑白图标" : "首字图标";

  return (
    <div ref={panelRef} className="settings-container">
      {/* 触发按钮 */}
      <button
        className="settings-trigger"
        onClick={togglePanel}
        type="button"
        title="设置"
      >
        <SettingsIcon className="w-6 h-6" />
      </button>

      {/* 弹出菜单 */}
      {isOpen && (
        <div className="settings-popover animate__animated animate__fadeIn animate__faster">
          {/* 主题 */}
          <button className="settings-row" onClick={onThemeToggle} type="button">
            <span className="settings-row-icon">
              {theme === "light" && <SunIcon className="w-5 h-5" />}
              {theme === "dark" && <MoonIcon className="w-5 h-5" />}
              {theme === "sync" && <SyncIcon className="w-5 h-5" />}
            </span>
            <span className="settings-row-label">主题</span>
            <span className="settings-row-value">{themeLabel}</span>
          </button>

          {/* 字体 */}
          <button className="settings-row" onClick={onFontToggle} type="button">
            <span className="settings-row-icon">
              <FontIcon className="w-5 h-5" />
            </span>
            <span className="settings-row-label">字体</span>
            <span className="settings-row-value">切换</span>
          </button>

          {/* 书签行数 */}
          <button className="settings-row" onClick={onRowsCycle} type="button">
            <span className="settings-row-icon">
              <span className="settings-rows-badge">{visibleRows}</span>
            </span>
            <span className="settings-row-label">书签行数</span>
            <span className="settings-row-value">{visibleRows} 行</span>
          </button>

          {/* 书签图标 */}
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
            <span className="settings-row-label">书签图标</span>
            <span className="settings-row-value">{iconTypeLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}