const g = require('sentences-bundle/sentences/g.json');
const target = g.find(item => item.hitokoto.includes('月色与雪色之间'));
console.log(target);
