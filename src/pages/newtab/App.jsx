import { POEM_MAXLINELENGTH, FONT_DISPLAY_NAMES } from "./services/constants";
import { getRandomPoem } from "./services/poems";
import { useState, useEffect, useRef } from "react";
import "animate.css";
import "./App.css";
import PoemDisplay from "./components/PoemDisplay";
import SettingsPanel from "./components/SettingsPanel";
import BookmarkBar from "./components/BookmarkBar";
import QuickSitesBar from "./components/QuickSitesBar";
import { useTheme } from "./hooks/useTheme";
import { useFont } from "./hooks/useFont";
// import { useVoice } from "./hooks/useVoice";
import { useGuide } from "./hooks/useGuide";
import { useBookmarks } from "./hooks/useBookmarks";
import { useBookmarkSettings } from "./hooks/useBookmarkSettings";
import { useQuickSites } from "./hooks/useQuickSites";
import { useResponsiveRows } from "./hooks/useResponsiveRows";
import { useCategories } from "./hooks/useCategories";

function getFormattedPoem(categories) {
  const p = getRandomPoem(categories);
  let newTitle = p.title || "";
  if (!/^[A-Za-z]/.test(newTitle[0])) {
    newTitle = newTitle
      .replace(/[^\u4E00-\u9FA5\t\n\r]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (newTitle.length >= POEM_MAXLINELENGTH) {
      const lines = newTitle.split(/\s+/);
      const result =
        lines.length % 2 === 0
          ? lines.reduce(
            (acc, line, i) => {
              if (i % 2 === 0) {
                acc.push(line);
              } else {
                acc[acc.length - 1] = `${acc[acc.length - 1]} ${line}`;
              }
              return acc;
            },
            []
          )
          : lines;
      newTitle = result.join("\n");
    }
  }
  return { ...p, title: newTitle };
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { currentFont, toggleFont } = useFont();
  const { bookmarks, loading } = useBookmarks();
  const {
    visibleRows, isExpanded, toggleExpand, cycleVisibleRows,
    iconType, toggleIconType,
    showBookmarks, toggleShowBookmarks,
    showQuickSites, toggleShowQuickSites,
  } = useBookmarkSettings();
  const { sites, addSite, editSite, removeSite } = useQuickSites();
  const [isQuickSitesExpanded, setIsQuickSitesExpanded] = useState(false);
  const { safeBookmarkRows, safeQuickSiteRows } = useResponsiveRows(
    visibleRows, showBookmarks, showQuickSites, sites.length
  );
  
  const { selectedCategories, toggleCategory } = useCategories();
  
  const [poem, setPoem] = useState(() => getFormattedPoem(selectedCategories));
  const [isAnimating, setIsAnimating] = useState(true);

  // 防止初次挂载时重复获取，只在分类改变时才获取新诗句
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPoem(getFormattedPoem(selectedCategories));
  }, [selectedCategories]);

  useGuide();

  // 当诗句更新时触发动画
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [poem.title]);

  // 是否两个区域都显示（用于决定是否显示区域标题）
  const bothVisible = showBookmarks && showQuickSites && sites.length > 0;

  return (
    <div id="app" className="custom-font" style={{ "--custom-font-name": currentFont }}>
      <div className="min-h-screen flex flex-col items-center">
        {/* 当内容多（bothVisible）时，上方留白多，整体内容偏下 4:2
            当内容少时，上下留白近似相等 3:3 或 4:4，使诗句居中 */}
        <div className={`w-full ${bothVisible ? "flex-grow-[4]" : "flex-grow-[3]"}`} />

        <PoemDisplay poem={poem} isAnimating={isAnimating} />

        <div className="sections-wrapper">
          {showBookmarks && (
            <>
              {bothVisible && <div className="section-label">书签</div>}
              <BookmarkBar
                bookmarks={bookmarks}
                loading={loading}
                visibleRows={safeBookmarkRows}
                isExpanded={isExpanded}
                toggleExpand={toggleExpand}
                iconType={iconType}
              />
            </>
          )}

          {showQuickSites && (
            <>
              {bothVisible && <div className="section-label">常用网站</div>}
              <QuickSitesBar
                sites={sites}
                addSite={addSite}
                editSite={editSite}
                removeSite={removeSite}
                iconType={iconType}
                visibleRows={safeQuickSiteRows}
                isExpanded={isQuickSitesExpanded}
                toggleExpand={() => setIsQuickSitesExpanded(prev => !prev)}
              />
            </>
          )}
        </div>

        <div className={`w-full ${bothVisible ? "flex-grow-[2]" : "flex-grow-[3]"}`} />
      </div>

      <SettingsPanel
        theme={theme}
        onThemeToggle={toggleTheme}
        onFontToggle={toggleFont}
        visibleRows={visibleRows}
        onRowsCycle={cycleVisibleRows}
        iconType={iconType}
        onIconTypeToggle={toggleIconType}
        showBookmarks={showBookmarks}
        onToggleBookmarks={toggleShowBookmarks}
        showQuickSites={showQuickSites}
        onToggleQuickSites={toggleShowQuickSites}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
      />

      {/* 右下角显示当前字体名 */}
      <div className="fixed bottom-6 right-6 text-sm opacity-15 select-none pointer-events-none">
        {FONT_DISPLAY_NAMES[currentFont] || currentFont}
      </div>
    </div>
  );
}
