const d = require('./node_modules/sentences-bundle/sentences/d.json');
const g = require('./node_modules/sentences-bundle/sentences/g.json');
const i = require('./node_modules/sentences-bundle/sentences/i.json');
const allSentencesMap = { d, g, i };

const merged = [];
for (const cat of ['i', 'd']) {
  const list = allSentencesMap[cat];
  if (list && Array.isArray(list)) merged.push(...list);
}
const unique = merged.filter((item, index, self) => index === self.findIndex((t) => t.hitokoto === item.hitokoto));

const t1 = unique.findIndex(p => p.hitokoto.includes('月色与雪色之间，你是第三种绝色。'));
console.log('月色 index:', t1, unique[t1]);

const t2 = unique.findIndex(p => p.from === '三体');
console.log('三体 index:', t2, unique[t2]);
