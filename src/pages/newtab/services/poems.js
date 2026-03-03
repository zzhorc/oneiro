import JSON_POEM from "sentences-bundle/sentences/i.json";

/**
 * @typedef {Object} Poem
 * @property {string} title - 诗句内容
 * @property {string} from - 诗句来源
 * @property {string} who - 诗句作者
 */

const STORAGE_KEY_ORDER = "poemShuffledOrder";
const STORAGE_KEY_INDEX = "poemCurrentIndex";

/**
 * Fisher-Yates 洗牌算法
 * @param {number[]} arr - 索引数组
 * @returns {number[]} 打乱后的数组
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 去重诗句数据，以 hitokoto 文本为唯一键
 * @returns {Array} 去重后的诗句数组
 */
function getUniquePoems() {
  const seen = new Set();
  return JSON_POEM.filter((item) => {
    if (seen.has(item.hitokoto)) return false;
    seen.add(item.hitokoto);
    return true;
  });
}

const uniquePoems = getUniquePoems();

/**
 * 生成新的洗牌顺序并重置索引
 */
function reshuffleAndSave() {
  const indices = Array.from({ length: uniquePoems.length }, (_, i) => i);
  const shuffled = shuffle(indices);
  localStorage.setItem(STORAGE_KEY_ORDER, JSON.stringify(shuffled));
  localStorage.setItem(STORAGE_KEY_INDEX, "0");
  return shuffled;
}

/**
 * 获取随机诗句（洗牌算法，保证全部展示完才重复）
 * @returns {Poem}
 */
export function getRandomPoem() {
  let order;
  let index;

  try {
    const storedOrder = localStorage.getItem(STORAGE_KEY_ORDER);
    index = Number.parseInt(localStorage.getItem(STORAGE_KEY_INDEX) || "0", 10);

    if (!storedOrder) {
      // 首次使用，生成洗牌顺序
      order = reshuffleAndSave();
      index = 0;
    } else {
      order = JSON.parse(storedOrder);

      // 数据源更新时（长度不匹配），重新洗牌
      if (order.length !== uniquePoems.length) {
        order = reshuffleAndSave();
        index = 0;
      }
    }

    // 到末尾，重新洗牌
    if (index >= order.length) {
      order = reshuffleAndSave();
      index = 0;
    }
  } catch {
    // localStorage 异常时降级为纯随机
    const randomIndex = Math.floor(Math.random() * uniquePoems.length);
    const { hitokoto: title, from, from_who: who } = uniquePoems[randomIndex];
    return { title, from, who };
  }

  const poemIndex = order[index];
  const { hitokoto: title, from, from_who: who } = uniquePoems[poemIndex];

  // 推进索引
  localStorage.setItem(STORAGE_KEY_INDEX, String(index + 1));

  return { title, from, who };
}
