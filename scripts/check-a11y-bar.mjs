import { readFile } from "node:fs/promises";
import path from "node:path";

function fail(message) {
  // eslint-disable-next-line no-console
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

async function main() {
  const root = process.cwd();
  const distIndex = path.join(root, ".pages-dist", "index.html");
  const galleryCss = path.join(root, "apps", "gallery", "src", "app", "globals.css");

  let html;
  try {
    html = await readFile(distIndex, "utf8");
  } catch (err) {
    fail(`Missing ${distIndex}. Run "npm run build:pages" first.`);
    return;
  }

  if (!html.includes('href="#main"')) {
    fail(`Gallery index is missing a skip-link (expected href="#main").`);
  }
  if (!html.includes('id="main"')) {
    fail(`Gallery index is missing an anchor target (expected id="main").`);
  }

  let css;
  try {
    css = await readFile(galleryCss, "utf8");
  } catch {
    fail(`Missing ${galleryCss}.`);
    return;
  }

  if (!css.includes(":focus-visible")) {
    fail(`Gallery globals.css is missing :focus-visible styling.`);
  }
  if (!css.includes(".skip-link")) {
    fail(`Gallery globals.css is missing .skip-link styling.`);
  }

  if (process.exitCode === 1) return;
  // eslint-disable-next-line no-console
  console.log("[PASS] a11y bar checks (skip-link + focus-visible) look good.");
}

await main();

