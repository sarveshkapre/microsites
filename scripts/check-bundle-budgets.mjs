import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const viteApps = ["neon-cinematic", "playful-micro", "dataviz-scrolly"];
const budgetBytes = Number(process.env.BUNDLE_BUDGET_BYTES ?? 500 * 1024);

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`;
}

async function largestJsBundle(app) {
  const assetDir = path.join(process.cwd(), "apps", app, "dist", "assets");
  const entries = await readdir(assetDir, { withFileTypes: true });
  const jsFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".js"));

  if (jsFiles.length === 0) {
    throw new Error(`No JS bundles found for apps/${app} in ${assetDir}. Run build first.`);
  }

  let largest = {
    filename: jsFiles[0].name,
    size: 0,
  };

  for (const file of jsFiles) {
    const filePath = path.join(assetDir, file.name);
    const size = (await stat(filePath)).size;
    if (size > largest.size) {
      largest = { filename: file.name, size };
    }
  }

  return largest;
}

async function main() {
  let failures = 0;

  console.log(`Bundle budget: ${formatBytes(budgetBytes)} max per Vite JS asset`);
  for (const app of viteApps) {
    const largest = await largestJsBundle(app);
    const status = largest.size <= budgetBytes ? "PASS" : "FAIL";
    console.log(
      `[${status}] apps/${app}/dist/assets/${largest.filename} (${formatBytes(largest.size)})`,
    );
    if (largest.size > budgetBytes) {
      failures += 1;
    }
  }

  if (failures > 0) {
    throw new Error(`${failures} app bundle(s) exceeded budget.`);
  }
}

await main();
