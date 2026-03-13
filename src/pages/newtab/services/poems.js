import a from "sentences-bundle/sentences/a.json";
import b from "sentences-bundle/sentences/b.json";
import c from "sentences-bundle/sentences/c.json";
import d from "sentences-bundle/sentences/d.json";
import e from "sentences-bundle/sentences/e.json";
import f from "sentences-bundle/sentences/f.json";
import g from "sentences-bundle/sentences/g.json";
import h from "sentences-bundle/sentences/h.json";
import i from "sentences-bundle/sentences/i.json";
import j from "sentences-bundle/sentences/j.json";
import k from "sentences-bundle/sentences/k.json";
import l from "sentences-bundle/sentences/l.json";

const allSentencesMap = { a, b, c, d, e, f, g, h, i, j, k, l };

/**
 * @typedef {Object} Poem
 * @property {string} title - 诗句内容
 * @property {string} from - 诗句来源
 * @property {string} who - 诗句作者
 */

const STORAGE_KEY_ORDER = "poemShuffledOrder";
const STORAGE_KEY_INDEX = "poemCurrentIndex";
const STORAGE_KEY_LAST_CATEGORIES = "poemLastCategories";

/**
 * Fisher-Yates 洗牌算法
 * @param {number[]} arr - 索引数组
 * @returns {number[]} 打乱后的数组
 */
function shuffle(arr) {
  const a = [...arr];
  for (let idx = a.length - 1; idx > 0; idx--) {
    const j = Math.floor(Math.random() * (idx + 1));
    [a[idx], a[j]] = [a[j], a[idx]];
  }
  return a;
}

/**
 * 去重并合并特定类别的诗句数据
 * @param {string[]} categories - 需要合并的类别 key 数组
 * @returns {Array} 去重后的诗句数组
 */
function getUniquePoems(categories = ["i"]) {
  const seen = new Set();
  const merged = [];
  for (const cat of categories) {
    const list = allSentencesMap[cat];
    if (list && Array.isArray(list)) {
      merged.push(...list);
    }
  }

  return merged.filter((item) => {
    if (seen.has(item.hitokoto)) return false;
    seen.add(item.hitokoto);
    return true;
  });
}

// 内部缓存当前处理的数据
let currentUniquePoems = [];

/**
 * 生成新的洗牌顺序（基于 UUID）并重置索引
 */
function reshuffleAndSave(uniquePoems) {
  const uuids = uniquePoems.map((p) => p.uuid);
  const shuffled = shuffle(uuids);
  localStorage.setItem(STORAGE_KEY_ORDER, JSON.stringify(shuffled));
  localStorage.setItem(STORAGE_KEY_INDEX, "0");
  return shuffled;
}

/**
 * 获取或者初始化当前分类的数据
 * 当分类发生变化时，会触发重新洗牌
 * @param {string[]} selectedCategories
 */
function ensureDataFreshness(selectedCategories) {
  const storedCatsJson = localStorage.getItem(STORAGE_KEY_LAST_CATEGORIES);
  const currentCatsJson = JSON.stringify(selectedCategories);

  // 分类变化或者首次加载当前内存为空
  if (storedCatsJson !== currentCatsJson || currentUniquePoems.length === 0) {
    currentUniquePoems = getUniquePoems(selectedCategories);
    localStorage.setItem(STORAGE_KEY_LAST_CATEGORIES, currentCatsJson);
    reshuffleAndSave(currentUniquePoems);
    return true; // 表示数据/顺序发生了更新
  }
  return false;
}

/**
 * 获取随机诗句（洗牌算法，保证全部展示完才重复）
 * @param {string[]} selectedCategories - 当前勾选的类别
 * @returns {Poem}
 */
export function getRandomPoem(selectedCategories = ["i"]) {
  let order;
  let index;

  try {
    const isUpdated = ensureDataFreshness(selectedCategories);
    currentUniquePoems = getUniquePoems(selectedCategories);

    const storedOrder = localStorage.getItem(STORAGE_KEY_ORDER);
    index = Number.parseInt(localStorage.getItem(STORAGE_KEY_INDEX) || "0", 10);

    if (!storedOrder || isUpdated) {
      // 如果没有存储顺序，或者刚更新了分类，需要重新读取顺序
      order = JSON.parse(localStorage.getItem(STORAGE_KEY_ORDER));
      index = 0;
    } else {
      order = JSON.parse(storedOrder);

      // 数据源意外不匹配时，重新洗牌
      if (order.length !== currentUniquePoems.length) {
        order = reshuffleAndSave(currentUniquePoems);
        index = 0;
      }
    }

    // 到末尾，重新洗牌
    if (index >= order.length) {
      order = reshuffleAndSave(currentUniquePoems);
      index = 0;
    }
  } catch {
    // localStorage 异常时降级为纯随机
    currentUniquePoems = getUniquePoems(selectedCategories);
    const randomIndex = Math.floor(Math.random() * currentUniquePoems.length);
    const poem = currentUniquePoems[randomIndex] || {};
    return { title: poem.hitokoto, from: poem.from, who: poem.from_who };
  }

  let targetUuid = order[index];
  let poem = currentUniquePoems.find((p) => p.uuid === targetUuid);

  // 如果按 uuid 找不到（可能是缓存的 uuid 过期），安全回退并即时重置
  if (!poem) {
    order = reshuffleAndSave(currentUniquePoems);
    index = 0;
    targetUuid = order[index];
    poem = currentUniquePoems.find((p) => p.uuid === targetUuid) || currentUniquePoems[0] || {};
  }

  // 推进索引
  localStorage.setItem(STORAGE_KEY_INDEX, String(index + 1));

  return { title: poem.hitokoto, from: poem.from, who: poem.from_who };
}
