#!/usr/bin/env node
// Keeps a Vite dev server running and screenshots it on demand, so changes
// can be visually verified without a human opening a browser.
//
// Usage: node scripts/view.mjs [route] [--out=path.png] [--width=1440] [--height=900]
//   route defaults to "/". Output defaults to a timestamped PNG under the OS tmp dir.

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, openSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const ROOT = process.cwd();
const STATE_DIR = path.join(os.tmpdir(), 'portfolio-site-view');
mkdirSync(STATE_DIR, { recursive: true });
const STATE_FILE = path.join(STATE_DIR, 'server.json');
const LOG_FILE = path.join(STATE_DIR, 'dev-server.log');
const PORT = 5173;
const URL_BASE = `http://localhost:${PORT}`;

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function ping(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return res.status < 500;
  } catch {
    return false;
  }
}

async function ensureServer() {
  if (await ping(URL_BASE)) return;

  if (existsSync(STATE_FILE)) {
    const state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
    if (isAlive(state.pid) && (await ping(URL_BASE))) return;
  }

  const out = openSync(LOG_FILE, 'a');
  const child = spawn(
    'npm',
    ['run', 'dev', '--', '--port', String(PORT), '--strictPort'],
    { cwd: ROOT, detached: true, stdio: ['ignore', out, out] },
  );
  child.unref();
  writeFileSync(STATE_FILE, JSON.stringify({ pid: child.pid, port: PORT }));

  const start = Date.now();
  while (Date.now() - start < 20000) {
    if (await ping(URL_BASE)) return;
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Dev server did not come up within 20s; check ${LOG_FILE}`);
}

function parseArgs(argv) {
  const flags = {};
  let route = '/';
  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) flags[match[1]] = match[2];
    else route = arg;
  }
  return { route, flags };
}

async function main() {
  const { route, flags } = parseArgs(process.argv.slice(2));
  const outPath = flags.out
    ? path.resolve(flags.out)
    : path.join(STATE_DIR, `screenshot-${Date.now()}.png`);
  const width = flags.width ? parseInt(flags.width, 10) : 1440;
  const height = flags.height ? parseInt(flags.height, 10) : 900;

  await ensureServer();

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });

  const consoleMessages = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => consoleMessages.push(`[pageerror] ${err.message}`));

  const url = new URL(route, URL_BASE).toString();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: outPath, fullPage: true });
  await browser.close();

  console.log(
    JSON.stringify({ ok: true, url, screenshot: outPath, consoleMessages }, null, 2),
  );
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: err.message }, null, 2));
  process.exit(1);
});
