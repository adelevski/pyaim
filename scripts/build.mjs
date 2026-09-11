import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
process.chdir(fileURLToPath(new URL("../", import.meta.url)));
await rm("dist", { recursive: true, force: true });
await mkdir("dist");
await cp("web", "dist", { recursive: true });
await cp("LICENSE", "dist/LICENSE");
const { version } = JSON.parse(await readFile("package.json", "utf8"));
await writeFile("dist/version.json", JSON.stringify({ version }) + "\n");
await writeFile("dist/.nojekyll", "");
for (const file of [
  "index.html",
  "style.css",
  "app.js",
  "game.js",
  "icon.png",
  "favicon.png",
  "apple-touch-icon.png",
]) {
  if (!(await readFile(`dist/${file}`)).length)
    throw new Error(`Empty asset: ${file}`);
}
console.log(`Built maim ${version}`);
