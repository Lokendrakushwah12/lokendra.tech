#!/usr/bin/env node
// Render HTML screens at phone resolution with headless Chrome. No dependencies.
//
//   node render.mjs screens/                      every .html in the folder
//   node render.mjs a.html b.html --sheet cmp.png  plus one side-by-side image
//   node render.mjs home.html --device iphone-max
//   node render.mjs home.html --device 393x1600    a tall capture of a scrolling screen
//   node render.mjs --self-test
//
// Each PNG is written next to its HTML file (or into --out DIR).

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { inflateSync } from "node:zlib";

// [width pt, height pt, pixel scale]
const DEVICES = {
  iphone: [393, 852, 3], // 1179 x 2556
  "iphone-max": [430, 932, 3], // 1290 x 2796
  "iphone-se": [375, 667, 2],
  android: [412, 915, 2.625],
  ipad: [820, 1180, 2],
};

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);
  for (const path of candidates) if (existsSync(path)) return path;
  for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge"]) {
    try {
      return execFileSync("which", [name], { encoding: "utf8" }).trim();
    } catch {}
  }
  throw new Error("No Chrome, Chromium, Edge or Brave found. Install one, or set CHROME_PATH to its binary.");
}

// Chrome will not lay out a window narrower than 500px: ask for 393 and the
// page is laid out at 500 and cropped, so everything on the right is cut off.
// For narrow devices the page is loaded in an iframe of the exact point size,
// magnified k times inside a window k times larger, at 1/k of the pixel scale.
// Layout width and output pixels both come out right. (Inside the page,
// devicePixelRatio reads scale/k, not scale.)
const MIN_WINDOW_WIDTH = 500;

function screenshot(chrome, url, out, [width, height, scale]) {
  mkdirSync(dirname(out), { recursive: true });
  const k = Math.max(1, Math.ceil(MIN_WINDOW_WIDTH / width));
  const dir = mkdtempSync(join(tmpdir(), "un-slop-"));
  try {
    let target = url;
    if (k > 1) {
      const frame = join(dir, "frame.html");
      writeFileSync(
        frame,
        `<!doctype html><meta charset="utf-8"><style>html{overflow:hidden;background:#fff}body{margin:0}
        iframe{display:block;border:0;width:${width}px;height:${height}px;transform:scale(${k});transform-origin:0 0}
        </style><iframe src="${url}"></iframe>`,
      );
      target = pathToFileURL(frame).href;
    }
    execFileSync(
      chrome,
      [
        "--headless=new",
        "--hide-scrollbars",
        "--no-first-run",
        "--disable-gpu",
        "--allow-file-access-from-files",
        `--window-size=${width * k},${height * k}`,
        `--force-device-scale-factor=${scale / k}`,
        "--virtual-time-budget=3000", // let fonts load and entrance animations finish
        `--screenshot=${out}`,
        target,
      ],
      { stdio: "pipe", timeout: 60_000 },
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  if (!existsSync(out)) throw new Error(`Chrome wrote no screenshot for ${url}`);
  const png = readFileSync(out);
  return [png.readUInt32BE(16), png.readUInt32BE(20)]; // IHDR width, height
}

// [r, g, b] of one pixel. Only the self-test needs it: enough PNG decoding to
// prove the right edge of the layout really is the right edge of the image.
function pixel(file, x, y) {
  const png = readFileSync(file);
  const width = png.readUInt32BE(16);
  const bpp = png[25] === 6 ? 4 : 3; // Chrome writes 8-bit RGBA or RGB
  const data = [];
  for (let at = 8; at < png.length; ) {
    const length = png.readUInt32BE(at);
    if (png.toString("latin1", at + 4, at + 8) === "IDAT") data.push(png.subarray(at + 8, at + 8 + length));
    at += 12 + length;
  }
  const raw = inflateSync(Buffer.concat(data));
  const stride = width * bpp;
  let previous = Buffer.alloc(stride);
  let row = previous;
  for (let r = 0; r <= y; r++) {
    const start = r * (stride + 1);
    const filter = raw[start];
    row = Buffer.from(raw.subarray(start + 1, start + 1 + stride));
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? row[i - bpp] : 0;
      const b = previous[i];
      const c = i >= bpp ? previous[i - bpp] : 0;
      const p = a + b - c;
      const [pa, pb, pc] = [Math.abs(p - a), Math.abs(p - b), Math.abs(p - c)];
      const paeth = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      row[i] = (row[i] + [0, a, b, (a + b) >> 1, paeth][filter]) & 255;
    }
    previous = row;
  }
  return [...row.subarray(x * bpp, x * bpp + 3)];
}

function parseDevice(value) {
  if (DEVICES[value]) return DEVICES[value];
  const match = /^(\d+)x(\d+)$/.exec(value);
  if (!match) throw new Error(`Unknown device "${value}". Use ${Object.keys(DEVICES).join(", ")} or WIDTHxHEIGHT in points.`);
  return [Number(match[1]), Number(match[2]), 3];
}

function collect(paths) {
  const files = [];
  for (const path of paths) {
    const full = resolve(path);
    if (!existsSync(full)) throw new Error(`Not found: ${path}`);
    if (statSync(full).isDirectory()) {
      for (const name of readdirSync(full).sort()) if (/\.html?$/i.test(name)) files.push(join(full, name));
    } else files.push(full);
  }
  if (!files.length) throw new Error("No .html files to render.");
  return files;
}

// One image with the screens side by side, each at its real point size.
function sheet(chrome, shots, out, [width, height]) {
  const gap = 32;
  const label = 28;
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:${gap}px;display:flex;gap:${gap}px;background:#e9e9e6;font:13px/${label}px ui-monospace,Menlo,monospace;color:#444}
    figure{margin:0} img{display:block;width:${width}px;height:${height}px;box-shadow:0 0 0 1px #0002}
  </style>${shots.map((s) => `<figure><figcaption>${basename(s.html)}</figcaption><img src="${pathToFileURL(s.png)}"></figure>`).join("")}`;
  const dir = mkdtempSync(join(tmpdir(), "un-slop-"));
  const page = join(dir, "sheet.html");
  writeFileSync(page, html);
  const size = [shots.length * width + (shots.length + 1) * gap, height + label + 2 * gap, 2];
  try {
    return screenshot(chrome, pathToFileURL(page).href, resolve(out), size);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function selfTest() {
  const chrome = findChrome();
  const dir = mkdtempSync(join(tmpdir(), "un-slop-test-"));
  try {
    const html = join(dir, "a.html");
    // red block pinned to the left edge, green to the right, blue to the bottom
    writeFileSync(
      html,
      `<!doctype html><body style="margin:0;font:17px system-ui">hello
      <i style="position:fixed;left:0;top:0;width:20px;height:20px;background:#f00"></i>
      <i style="position:fixed;right:0;top:0;width:20px;height:20px;background:#0f0"></i>
      <i style="position:fixed;right:0;bottom:0;width:20px;height:20px;background:#00f"></i>`,
    );
    const png = join(dir, "a.png");
    const [w, h] = screenshot(chrome, pathToFileURL(html).href, png, DEVICES.iphone);
    if (w !== 1179 || h !== 2556) throw new Error(`expected 1179x2556, got ${w}x${h}`);
    console.log("ok  iphone render is 1179 x 2556");
    const is = ([r, g, b], want) => `${r > 200 ? 1 : 0}${g > 200 ? 1 : 0}${b > 200 ? 1 : 0}` === want;
    if (!is(pixel(png, 15, 15), "100")) throw new Error("left edge marker missing");
    if (!is(pixel(png, 1179 - 15, 15), "010")) throw new Error("page was laid out wider than 393pt: right edge is cropped");
    if (!is(pixel(png, 1179 - 15, 2556 - 15), "001")) throw new Error("page was laid out taller than 852pt: bottom edge is cropped");
    console.log("ok  layout is exactly 393 x 852 pt (all three edge markers land on the image edges)");
    const [iw, ih] = screenshot(chrome, pathToFileURL(html).href, join(dir, "ipad.png"), DEVICES.ipad);
    if (iw !== 1640 || ih !== 2360 || !is(pixel(join(dir, "ipad.png"), 1640 - 15, 15), "010")) throw new Error(`ipad render wrong: ${iw}x${ih}`);
    console.log("ok  ipad render is 1640 x 2360 with the right edge intact");
    const [sw, sh] = sheet(chrome, [{ html, png }, { html, png }], join(dir, "sheet.png"), DEVICES.iphone);
    if (sw !== (2 * 393 + 3 * 32) * 2 || sh !== (852 + 28 + 64) * 2) throw new Error(`unexpected sheet size ${sw}x${sh}`);
    console.log(`ok  two-up sheet is ${sw} x ${sh}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function main(argv) {
  if (argv.includes("--help") || argv.includes("-h") || !argv.length) {
    console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 11).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
    console.log(`\nDevices: ${Object.entries(DEVICES).map(([name, [w, h, s]]) => `${name} ${w}x${h}@${s}x`).join(", ")}`);
    return;
  }
  if (argv.includes("--self-test")) return selfTest();

  const option = (flag) => {
    const i = argv.indexOf(flag);
    if (i === -1) return undefined;
    const [, value] = argv.splice(i, 2);
    if (!value) throw new Error(`${flag} needs a value`);
    return value;
  };
  const device = parseDevice(option("--device") ?? "iphone");
  const scale = option("--scale");
  if (scale) device[2] = Number(scale);
  const outDir = option("--out");
  const sheetOut = option("--sheet");

  const chrome = findChrome();
  const shots = collect(argv).map((html) => {
    const png = join(outDir ? resolve(outDir) : dirname(html), basename(html, extname(html)) + ".png");
    const [w, h] = screenshot(chrome, pathToFileURL(html).href, png, device);
    console.log(`${png}  ${w} x ${h}`);
    return { html, png };
  });
  if (sheetOut) {
    const [w, h] = sheet(chrome, shots, sheetOut, device);
    console.log(`${resolve(sheetOut)}  ${w} x ${h}  (side by side)`);
  }
  if (process.platform !== "darwin") {
    console.log("note: not macOS, so the system font is not Apple's San Francisco. Treat type as approximate.");
  }
}

try {
  main(process.argv.slice(2));
} catch (error) {
  console.error(`render: ${error.message}`);
  process.exit(1);
}
