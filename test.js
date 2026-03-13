const a = [{hitokoto: "A1", from: "F_A1"}, {hitokoto: "A2", from: "F_A2"}];
const b = [{hitokoto: "B1", from: "F_B1"}, {hitokoto: "B2", from: "F_B2"}];
const allSentencesMap = { a, b };

function getUniquePoems(categories) {
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
console.log(getUniquePoems(['a', 'b']));
