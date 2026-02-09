import process from "node:process";
import { spawn } from "node:child_process";

function tailPush(buffer, line, maxLines = 200) {
  buffer.push(line);
  if (buffer.length > maxLines) buffer.splice(0, buffer.length - maxLines);
}

function captureStreamLines(stream, buffer, prefix) {
  if (!stream) return;
  stream.setEncoding("utf8");
  let carry = "";
  stream.on("data", (chunk) => {
    carry += chunk;
    const lines = carry.split("\n");
    carry = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.replace(/\r$/, "");
      if (trimmed.length === 0) continue;
      tailPush(buffer, `${prefix}${trimmed}`);
    }
  });
  stream.on("end", () => {
    const trimmed = carry.replace(/\r$/, "");
    if (trimmed.length > 0) tailPush(buffer, `${prefix}${trimmed}`);
    carry = "";
  });
}

function parseArgs(argv) {
  const args = {
    app: null,
    port: null,
    host: "localhost",
    path: "/",
    timeoutMs: 20_000,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--app") {
      args.app = argv[i + 1] ?? null;
      i += 1;
      continue;
    }
    if (token === "--port") {
      const raw = argv[i + 1];
      args.port = raw ? Number(raw) : null;
      i += 1;
      continue;
    }
    if (token === "--path") {
      args.path = argv[i + 1] ?? "/";
      i += 1;
      continue;
    }
    if (token === "--host") {
      args.host = argv[i + 1] ?? "localhost";
      i += 1;
      continue;
    }
    if (token === "--timeout-ms") {
      const raw = argv[i + 1];
      args.timeoutMs = raw ? Number(raw) : args.timeoutMs;
      i += 1;
      continue;
    }
  }

  return args;
}

function usageAndExit(code) {
  // Keep this terse: this is meant for CI/local automation.
  // eslint-disable-next-line no-console
  console.error(
    "Usage: node scripts/smoke.mjs --app <workspace> [--port <n>] [--host <h>] [--path </>] [--timeout-ms <n>]",
  );
  process.exit(code);
}

function isFinitePort(port) {
  return Number.isFinite(port) && port > 0 && port < 65536;
}

async function waitForHttpOk(url, timeoutMs) {
  const startedAt = Date.now();
  let lastErr = null;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3_000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) return res;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastErr = err;
    }

    await new Promise((r) => setTimeout(r, 250));
  }

  const err = new Error(`Timed out waiting for ${url}`);
  err.cause = lastErr;
  throw err;
}

function spawnDevServer(app, port, host) {
  const nextApps = new Set([
    "gallery",
    "premium-product",
    "editorial-scrolly",
    "webgl-dom-sync",
  ]);

  const isNext = nextApps.has(app);
  const args = ["run", "dev", "-w", app, "--", "--port", String(port)];
  if (!isNext) {
    args.push("--host", host);
    args.push("--strictPort");
  } else {
    args.push("--hostname", host);
  }

  const child = spawn("npm", args, {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true, // Enables killing the whole process group.
    env: { ...process.env },
  });

  return child;
}

function killProcessTree(child) {
  if (!child || child.pid == null) return;
  try {
    process.kill(-child.pid, "SIGINT");
  } catch {
    try {
      child.kill("SIGINT");
    } catch {
      // Ignore.
    }
  }
}

async function main() {
  const { app, port: portArg, host, path, timeoutMs } = parseArgs(process.argv);
  if (!app) usageAndExit(2);

  const port =
    portArg ??
    (["neon-cinematic", "playful-micro", "dataviz-scrolly"].includes(app)
      ? 5173
      : 3000);

  if (!isFinitePort(port)) {
    // eslint-disable-next-line no-console
    console.error(`Invalid port: ${port}`);
    process.exit(2);
  }

  const url = `http://${host}:${port}${path}`;
  const expected = `data-microsite="${app}"`;

  const devLogs = [];
  const child = spawnDevServer(app, port, host);
  captureStreamLines(child.stdout, devLogs, "");
  captureStreamLines(child.stderr, devLogs, "");

  let failed = false;
  let res;
  try {
    res = await waitForHttpOk(url, timeoutMs);
    const html = await res.text();
    if (!html.includes(expected)) {
      throw new Error(`Missing marker ${expected} in ${url}`);
    }
    // eslint-disable-next-line no-console
    console.log(`[PASS] ${app} responded and exposed ${expected}`);
  } catch (err) {
    failed = true;
    throw err;
  } finally {
    killProcessTree(child);
    if (failed && devLogs.length > 0) {
      // eslint-disable-next-line no-console
      console.error("--- dev server output (tail) ---");
      // eslint-disable-next-line no-console
      console.error(devLogs.join("\n"));
    }
  }
}

await main();
