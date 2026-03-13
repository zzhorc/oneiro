import { fontSplit } from "cn-font-split";
import fs from "node:fs/promises";

// 包含需要用到的所有字符的文件们
const textSrc = [
  "../../node_modules/sentences-bundle/sentences/a.json",
  "../../node_modules/sentences-bundle/sentences/b.json",
  "../../node_modules/sentences-bundle/sentences/c.json",
  "../../node_modules/sentences-bundle/sentences/d.json",
  "../../node_modules/sentences-bundle/sentences/e.json",
  "../../node_modules/sentences-bundle/sentences/f.json",
  "../../node_modules/sentences-bundle/sentences/g.json",
  "../../node_modules/sentences-bundle/sentences/h.json",
  "../../node_modules/sentences-bundle/sentences/i.json",
  "../../node_modules/sentences-bundle/sentences/j.json",
  "../../node_modules/sentences-bundle/sentences/k.json",
  "../../node_modules/sentences-bundle/sentences/l.json",
  "../../src/pages/newtab/App.jsx",
  "../../entrypoints/newtab/index.html",
  "../../entrypoints/background.js",
  "../../src/pages/newtab/components/SettingsPanel.jsx",
  "../../src/pages/newtab/components/BookmarkBar.jsx",
  "../../src/pages/newtab/components/PoemDisplay.jsx",
  "../../src/pages/newtab/components/QuickSitesBar.jsx",
];

async function main() {
  console.log("根据下列文件生成字符集：");
  console.log(textSrc);
  // 读取源文件
  let text = "";
  for (const src of textSrc) {
    text += await fs.readFile(src, "utf-8");
  }

  console.log(`文本长度: ${text.length}`);

  // 生成字符集
  const charset = [...new Set(text)].map((char) => char.charCodeAt(0));
  console.log(`唯一字符数: ${charset.length}`);

  // 获取字体文件列表
  const srcDir = "./.src/";
  const buildDir = "./build/";
  const fontList = await fs.readdir(srcDir);
  console.log(`字体文件: ${fontList.join(", ")}`);

  // 保留原有 build 内容，仅在存在 .src 时执行裁剪
  await fs.mkdir(buildDir, { recursive: true });

  // 处理每个在 .src 的字体文件
  for (const font of fontList) {
    if(!font.endsWith(".ttf") && !font.endsWith(".otf")) continue;
    const fontName = font.replace(".ttf", "").replace(".otf", "");
    await fontSplit({
      FontPath: srcDir + font,
      destFold: buildDir + fontName,
      outDir: buildDir + fontName,
      subsets: [charset],
      autoChunk: false,
      targetType: "woff2",
      reporter: false,
      testHTML: false,
    });
    console.log(`处理完成: ${font}`);
  }

  // 写入 fonts.css：扫描 build 目录中所有的已有成品
  const buildItems = await fs.readdir(buildDir);
  let resultCss = "";
  for (const item of buildItems) {
    if (!item.startsWith(".") && !item.includes(".")) {
      // 假定它是字体目录
      resultCss += `@import "${buildDir}${item}/result.css";\n`;
    }
  }
  await fs.writeFile("./fonts.css", resultCss, "utf-8");
}

main().catch(console.error);
