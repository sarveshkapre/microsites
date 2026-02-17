import { access, readFile } from "node:fs/promises";
import path from "node:path";

const manifestPath = path.join(
  process.cwd(),
  "apps",
  "gallery",
  "src",
  "lib",
  "microsites.ts",
);

const requestTimeoutMs = Number(process.env.DEPLOY_URL_TIMEOUT_MS ?? 8000);
const disableNetworkCheck = process.env.CHECK_DEPLOY_URLS === "0";

function parseManifest(source) {
  const pagesBaseMatch = source.match(
    /export const pagesBaseUrl\s*=\s*"([^"]+)"/,
  );
  if (!pagesBaseMatch) {
    throw new Error(`Unable to parse pagesBaseUrl from ${manifestPath}`);
  }

  const pagesBaseUrl = pagesBaseMatch[1];
  const entries = [];
  const entryRegex =
    /id:\s*"([^"]+)"[\s\S]*?repoPath:\s*"(apps\/[^"]+)"[\s\S]*?deployUrl:\s*`\$\{pagesBaseUrl\}([^`]+)`/g;
  let match = entryRegex.exec(source);
  while (match) {
    entries.push({
      id: match[1],
      repoPath: match[2],
      deployPath: match[3],
    });
    match = entryRegex.exec(source);
  }

  if (entries.length === 0) {
    throw new Error(`No deployable microsites found in ${manifestPath}`);
  }

  return { pagesBaseUrl, entries };
}

async function ensureRepoPathExists(repoPath) {
  const abs = path.join(process.cwd(), repoPath);
  try {
    await access(abs);
  } catch {
    throw new Error(`Missing repoPath directory: ${repoPath}`);
  }
}

async function fetchStatus(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
    });
    return response.status;
  } finally {
    clearTimeout(timer);
  }
}

async function validateDeployUrl(url) {
  const headStatus = await fetchStatus(url, "HEAD").catch(() => null);
  if (headStatus !== null && headStatus < 400) return headStatus;

  const getStatus = await fetchStatus(url, "GET");
  if (getStatus >= 400) {
    throw new Error(`HTTP ${getStatus}`);
  }
  return getStatus;
}

async function main() {
  const source = await readFile(manifestPath, "utf8");
  const { pagesBaseUrl, entries } = parseManifest(source);

  let failures = 0;

  for (const entry of entries) {
    await ensureRepoPathExists(entry.repoPath).catch((err) => {
      failures += 1;
      console.error(`[FAIL] ${entry.id}: ${err.message}`);
    });

    const url = `${pagesBaseUrl}${entry.deployPath}`;
    if (!disableNetworkCheck) {
      await validateDeployUrl(url)
        .then((status) => {
          console.log(`[PASS] ${entry.id}: ${url} (${status})`);
        })
        .catch((err) => {
          failures += 1;
          console.error(`[FAIL] ${entry.id}: ${url} (${err.message})`);
        });
    } else {
      console.log(`[PASS] ${entry.id}: ${url} (network checks disabled)`);
    }
  }

  if (failures > 0) {
    throw new Error(`${failures} deploy URL check(s) failed.`);
  }
}

await main();
