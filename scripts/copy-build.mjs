import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const targetDir = "/Users/xiaoyuan/Documents/Obsidain/Sloane/.obsidian/plugins/Niki-AI";
const filesToCopy = ["main.js", "manifest.json", "styles.css"];

fs.mkdirSync(targetDir, { recursive: true });

for (const file of filesToCopy) {
  const source = path.join(projectRoot, file);
  const destination = path.join(targetDir, file);
  fs.copyFileSync(source, destination);
}

console.log(`[copy-build] Copied ${filesToCopy.length} files to ${targetDir}`);
