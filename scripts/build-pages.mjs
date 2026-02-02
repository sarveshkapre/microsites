import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const pagesDist = path.join(root, ".pages-dist");

function run(cmd, args, env = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
  }
}

async function pathExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  await cp(from, to, { recursive: true });
}

function repoName() {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) return "microsites";
  return repo.split("/")[1] || "microsites";
}

async function detectNextOut(app, basePath) {
  const outRoot = path.join(root, "apps", app, "out");
  const baseSegs = basePath.split("/").filter(Boolean);

  const candidates = [
    path.join(outRoot, ...baseSegs),
    path.join(outRoot, baseSegs.at(-1) ?? ""),
    outRoot,
  ];

  for (const candidate of candidates) {
    if (await pathExists(path.join(candidate, "index.html"))) return candidate;
    if (await pathExists(path.join(candidate, "404.html"))) return candidate;
  }

  const listing = (await pathExists(outRoot)) ? await readdir(outRoot) : [];
  throw new Error(
    `Could not find Next export output for apps/${app}. Looked in: ${candidates.join(
      ", ",
    )}. out listing: ${listing.join(", ")}`,
  );
}

async function buildNext(app, basePath, targetSubdirOrNull) {
  run("npm", ["run", "build", "-w", app], { NEXT_PUBLIC_BASE_PATH: basePath });
  const outDir = await detectNextOut(app, basePath);
  const target = targetSubdirOrNull
    ? path.join(pagesDist, targetSubdirOrNull)
    : pagesDist;
  await copyDir(outDir, target);
}

async function buildVite(app, basePath, targetSubdir) {
  run("npm", ["run", "build", "-w", app], { VITE_BASE: basePath });
  const distDir = path.join(root, "apps", app, "dist");
  await copyDir(distDir, path.join(pagesDist, targetSubdir));
}

async function main() {
  const repo = repoName();
  const rootBase = `/${repo}`;

  await rm(pagesDist, { recursive: true, force: true });
  await mkdir(pagesDist, { recursive: true });

  await buildNext("gallery", rootBase, null);

  await buildNext("premium-product", `${rootBase}/premium-product`, "premium-product");
  await buildNext(
    "editorial-scrolly",
    `${rootBase}/editorial-scrolly`,
    "editorial-scrolly",
  );
  await buildNext("webgl-dom-sync", `${rootBase}/webgl-dom-sync`, "webgl-dom-sync");

  await buildVite("neon-cinematic", `${rootBase}/neon-cinematic/`, "neon-cinematic");
  await buildVite("playful-micro", `${rootBase}/playful-micro/`, "playful-micro");
  await buildVite("dataviz-scrolly", `${rootBase}/dataviz-scrolly/`, "dataviz-scrolly");
}

await main();

