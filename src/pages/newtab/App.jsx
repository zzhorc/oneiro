import { POEM_MAXLINELENGTH, FONT_DISPLAY_NAMES } from "./services/constants";
import { getRandomPoem } from "./services/poems";
import { useState, useEffect } from "react";
import "animate.css";
import "./App.css";
import PoemDisplay from "./components/PoemDisplay";
import SettingsPanel from "./components/SettingsPanel";
import BookmarkBar from "./components/BookmarkBar";
import { useTheme } from "./hooks/useTheme";
import { useFont } from "./hooks/useFont";
// import { useVoice } from "./hooks/useVoice";
import { useGuide } from "./hooks/useGuide";
import { useBookmarks } from "./hooks/useBookmarks";
import { useBookmarkSettings } from "./hooks/useBookmarkSettings";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { currentFont, toggleFont } = useFont();
  // const { isMuted, toggleMute, playVoice } = useVoice();
  const { bookmarks, loading } = useBookmarks();
  const { visibleRows, isExpanded, toggleExpand, cycleVisibleRows } = useBookmarkSettings();
  const [poem, setPoem] = useState(() => getRandomPoem());
  const [isAnimating, setIsAnimating] = useState(true);

  useGuide();

  useEffect(() => {
    let newTitle = poem.title;
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
    setPoem((prevPoem) => ({ ...prevPoem, title: newTitle }));
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [poem.title]);

  // const handleTitleClick = () => {
  //   playVoice(poem.title);
  // };

  return (
    <div id="app" className="custom-font" style={{ "--custom-font-name": currentFont }}>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <PoemDisplay poem={poem} isAnimating={isAnimating} />
        <BookmarkBar
          bookmarks={bookmarks}
          loading={loading}
          visibleRows={visibleRows}
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
        />
      </div>

      <SettingsPanel
        theme={theme}
        onThemeToggle={toggleTheme}
        onFontToggle={toggleFont}
        visibleRows={visibleRows}
        onRowsCycle={cycleVisibleRows}
      />

      {/* 右下角显示当前字体名 */}
      <div className="fixed bottom-6 right-6 text-sm opacity-15 select-none pointer-events-none">
        {FONT_DISPLAY_NAMES[currentFont] || currentFont}
      </div>
    </div>
  );
}
