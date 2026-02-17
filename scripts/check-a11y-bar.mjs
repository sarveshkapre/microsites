import { readFile } from "node:fs/promises";
import path from "node:path";

function fail(message) {
  // eslint-disable-next-line no-console
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

async function main() {
  const root = process.cwd();
  const routeChecks = [
    {
      label: "gallery",
      distIndex: path.join(root, ".pages-dist", "index.html"),
      cssPath: path.join(root, "apps", "gallery", "src", "app", "globals.css"),
    },
    {
      label: "premium-product",
      distIndex: path.join(root, ".pages-dist", "premium-product", "index.html"),
      cssPath: path.join(
        root,
        "apps",
        "premium-product",
        "src",
        "app",
        "globals.css",
      ),
    },
  ];

  for (const check of routeChecks) {
    let html;
    try {
      html = await readFile(check.distIndex, "utf8");
    } catch {
      fail(`Missing ${check.distIndex}. Run "npm run build:pages" first.`);
      continue;
    }

    if (!html.includes('href="#main"')) {
      fail(
        `${check.label} index is missing a skip-link (expected href="#main").`,
      );
    }
    if (!html.includes('id="main"')) {
      fail(`${check.label} index is missing an anchor target (expected id="main").`);
    }

    let css;
    try {
      css = await readFile(check.cssPath, "utf8");
    } catch {
      fail(`Missing ${check.cssPath}.`);
      continue;
    }

    if (!css.includes(":focus-visible")) {
      fail(`${check.label} globals.css is missing :focus-visible styling.`);
    }
    if (!css.includes(".skip-link")) {
      fail(`${check.label} globals.css is missing .skip-link styling.`);
    }
  }

  if (process.exitCode === 1) return;
  // eslint-disable-next-line no-console
  console.log(
    "[PASS] a11y bar checks (skip-link + focus-visible) look good for gallery and premium-product.",
  );
}

await main();
