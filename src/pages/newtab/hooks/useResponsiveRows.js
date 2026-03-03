import { useState, useEffect } from "react";

/**
 * 动态计算两个区域的安全行数分配
 * @param {number} userBookmarkRows - 用户设置期望显示的书签行数
 * @param {boolean} showBookmarks - 是否显示书签
 * @param {boolean} showQuickSites - 是否显示常用网站
 * @param {number} quickSiteCount - 常用网站数量
 * @returns {{ safeBookmarkRows: number, safeQuickSiteRows: number }}
 */
export function useResponsiveRows(userBookmarkRows, showBookmarks, showQuickSites, quickSiteCount) {
    const [safeRows, setSafeRows] = useState({ safeBookmarkRows: userBookmarkRows, safeQuickSiteRows: 1 });

    useEffect(() => {
        const calculateRows = () => {
            // 每次最多允许的空间（诗句区和留白等固定占用约 350px）
            const RESERVED_HEIGHT = 400; // 稍微保守一点，留出更多呼吸感
            const ROW_HEIGHT = 90; // 单行图标的大致高度

            const availableHeight = window.innerHeight - RESERVED_HEIGHT;
            let maxTotalRows = Math.max(1, Math.floor(availableHeight / ROW_HEIGHT)); // 至少保证能显示 1 行

            let finalBookmarkRows = 0;
            let finalQuickSiteRows = 0;

            if (showBookmarks && !showQuickSites) {
                // 只有书签：最多使用最大允许行数与用户设置之间的较小值
                finalBookmarkRows = Math.min(userBookmarkRows, maxTotalRows);
            } else if (!showBookmarks && showQuickSites) {
                // 只有常用网站：常用网站不受书签行数设置限制，如果有需要甚至可以占满
                finalQuickSiteRows = maxTotalRows;
            } else if (showBookmarks && showQuickSites && quickSiteCount > 0) {
                // 两者都有：
                // 1. 先保证常用网站至少有 1 行（最多 2 行，如果有很多空间的话）
                // 2. 剩下的给书签，但不超过用户的设置

                // 如果空间非常紧缺（只能放 1 行），不得不压缩
                if (maxTotalRows <= 1) {
                    finalBookmarkRows = 1;
                    finalQuickSiteRows = 1; // 溢出就溢出，没办法
                } else {
                    // 分配逻辑：常用网站视其需要，最多拿 2 行，至少 1 行
                    // 书签拿剩下的，但不超过用户设置
                    const neededQuickSiteRows = Math.ceil(quickSiteCount / window.innerWidth * 100); // 粗略估算，不是严格准确的所需行数
                    finalQuickSiteRows = maxTotalRows > 3 ? 2 : 1;

                    let remainingForBookmarks = maxTotalRows - finalQuickSiteRows;

                    // 如果剩余给书签的高度连 1 行都没有，压缩常用网站
                    if (remainingForBookmarks < 1) {
                        finalQuickSiteRows = 1;
                        remainingForBookmarks = maxTotalRows - finalQuickSiteRows;
                    }

                    finalBookmarkRows = Math.min(userBookmarkRows, Math.max(1, remainingForBookmarks));
                }
            }

            setSafeRows({
                safeBookmarkRows: finalBookmarkRows || userBookmarkRows, // fallback
                safeQuickSiteRows: finalQuickSiteRows || 1,
            });
        };

        calculateRows();
        window.addEventListener("resize", calculateRows);
        return () => window.removeEventListener("resize", calculateRows);
    }, [userBookmarkRows, showBookmarks, showQuickSites, quickSiteCount]);

    return safeRows;
}
