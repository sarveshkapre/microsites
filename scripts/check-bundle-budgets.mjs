import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const strictDefaultBudgetBytes = Number(
  process.env.BUNDLE_BUDGET_BYTES ?? 500 * 1024,
);

const appBudgets = [
  { app: "gallery", kind: "next", outputDir: "apps/gallery/out", budgetBytes: 600 * 1024 },
  {
    app: "premium-product",
    kind: "next",
    outputDir: "apps/premium-product/out",
    budgetBytes: 720 * 1024,
  },
  {
    app: "editorial-scrolly",
    kind: "next",
    outputDir: "apps/editorial-scrolly/out",
    budgetBytes: 720 * 1024,
  },
  {
    app: "webgl-dom-sync",
    kind: "next",
    outputDir: "apps/webgl-dom-sync/out",
    budgetBytes: 720 * 1024,
  },
  {
    app: "neon-cinematic",
    kind: "vite",
    outputDir: "apps/neon-cinematic/dist",
    budgetBytes: 360 * 1024,
  },
  {
    app: "playful-micro",
    kind: "vite",
    outputDir: "apps/playful-micro/dist",
    budgetBytes: 360 * 1024,
  },
  {
    app: "dataviz-scrolly",
    kind: "vite",
    outputDir: "apps/dataviz-scrolly/dist",
    budgetBytes: 260 * 1024,
  },
];

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`;
}

function parseScriptSources(html) {
  const sources = [];
  const scriptRegex = /<script\b[^>]*\bsrc=(["'])(.*?)\1[^>]*>/gi;
  let match = scriptRegex.exec(html);
  while (match) {
    sources.push(match[2]);
    match = scriptRegex.exec(html);
  }
  return [...new Set(sources)];
}

function toOutputRelativePath(kind, src) {
  const clean = src.split("?")[0] ?? src;
  if (!clean) return null;

  if (kind === "next") {
    const nextMarker = clean.indexOf("/_next/");
    if (nextMarker >= 0) return clean.slice(nextMarker + 1);
    if (clean.startsWith("_next/")) return clean;
    return null;
  }

  const assetsMarker = clean.indexOf("/assets/");
  if (assetsMarker >= 0) return clean.slice(assetsMarker + 1);
  if (clean.startsWith("assets/")) return clean;
  return null;
}

async function getEntrypointJsStats(entry) {
  const indexPath = path.join(process.cwd(), entry.outputDir, "index.html");
  const html = await readFile(indexPath, "utf8");
  const scriptSources = parseScriptSources(html);

  if (scriptSources.length === 0) {
    throw new Error(
      `No script src entries found in ${indexPath}. Run build first.`,
    );
  }

  let totalBytes = 0;
  let largest = { relPath: "", size: 0 };
  const missing = [];
  const seen = new Set();

  for (const source of scriptSources) {
    const relPath = toOutputRelativePath(entry.kind, source);
    if (!relPath || seen.has(relPath)) continue;
    seen.add(relPath);

    const filePath = path.join(process.cwd(), entry.outputDir, relPath);
    try {
      const file = await stat(filePath);
      totalBytes += file.size;
      if (file.size > largest.size) {
        largest = { relPath, size: file.size };
      }
    } catch {
      missing.push(relPath);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing built script files for apps/${entry.app}: ${missing.join(", ")}`,
    );
  }

  return {
    count: seen.size,
    largest,
    totalBytes,
  };
}

async function main() {
  let failures = 0;

  console.log(
    `Strict default budget: ${formatBytes(strictDefaultBudgetBytes)} per app entrypoint bundle`,
  );

  for (const entry of appBudgets) {
    const budgetBytes = entry.budgetBytes ?? strictDefaultBudgetBytes;
    const { count, largest, totalBytes } = await getEntrypointJsStats(entry);
    const status = totalBytes <= budgetBytes ? "PASS" : "FAIL";
    console.log(
      `[${status}] apps/${entry.app} (${entry.kind}) total=${formatBytes(totalBytes)} budget=${formatBytes(budgetBytes)} scripts=${count} largest=${largest.relPath} (${formatBytes(largest.size)})`,
    );
    if (status === "FAIL") failures += 1;
  }

  if (failures > 0) {
    throw new Error(`${failures} app bundle(s) exceeded budget.`);
  }
}

await main();
