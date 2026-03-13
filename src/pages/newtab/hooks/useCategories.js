import { useState, useEffect } from "react";

const STORAGE_KEY_CATEGORIES = "poemSelectedCategories";
const DEFAULT_CATEGORIES = ["i"]; // 默认只选诗词

export function useCategories() {
  const [selectedCategories, setSelectedCategories] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        // 确保解析出来的是数组且非空
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse selected categories from localStorage", e);
    }
    return DEFAULT_CATEGORIES;
  });

  const toggleCategory = (categoryKey) => {
    setSelectedCategories((prev) => {
      let nextCategories;
      if (prev.includes(categoryKey)) {
        // 拦截：如果只剩下一个分类被选中，则不允许取消
        if (prev.length <= 1) {
          return prev;
        }
        nextCategories = prev.filter((key) => key !== categoryKey);
      } else {
        nextCategories = [...prev, categoryKey];
      }
      return nextCategories;
    });
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(selectedCategories));
  }, [selectedCategories]);

  return {
    selectedCategories,
    toggleCategory,
  };
}
