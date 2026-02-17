import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const appsDir = path.join(process.cwd(), "apps");
const reducedMotionPattern = /\breduced[-\s]?motion\b|prefers-reduced-motion/i;
const perfModePattern = /\bperf(?:ormance)?\s*mode\b/i;

function fail(message) {
  // eslint-disable-next-line no-console
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

async function main() {
  let appEntries;
  try {
    appEntries = await readdir(appsDir, { withFileTypes: true });
  } catch {
    fail(`Missing apps directory: ${appsDir}`);
    return;
  }

  const appNames = appEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const app of appNames) {
    const readmePath = path.join(appsDir, app, "README.md");
    let readme;
    try {
      readme = await readFile(readmePath, "utf8");
    } catch {
      fail(`Missing README.md for apps/${app}`);
      continue;
    }

    if (!reducedMotionPattern.test(readme)) {
      fail(`apps/${app}/README.md must mention reduced-motion support.`);
    }
    if (!perfModePattern.test(readme)) {
      fail(`apps/${app}/README.md must mention perf-mode behavior.`);
    }
  }

  if (process.exitCode === 1) return;
  // eslint-disable-next-line no-console
  console.log("[PASS] Motion contract docs present in every app README.");
}

await main();
