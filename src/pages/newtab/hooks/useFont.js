import { useState, useCallback, useEffect } from "react";
import { FONTNAME_LIST } from "../services/constants";

export function useFont() {
  const [fontIndex, setFontIndex] = useState(() => Number.parseInt(localStorage.getItem("fontIndex") || "0", 10));

  useEffect(() => {
    localStorage.setItem("fontIndex", fontIndex.toString());
    // 同时设置到 :root，让 portal 内容（文件夹弹窗）也继承字体
    document.documentElement.style.setProperty("--custom-font-name", FONTNAME_LIST[fontIndex]);
  }, [fontIndex]);

  const toggleFont = useCallback(() => {
    setFontIndex((prevIndex) => (prevIndex + 1) % FONTNAME_LIST.length);
  }, []);

  return { fontIndex, toggleFont, currentFont: FONTNAME_LIST[fontIndex] };
} 