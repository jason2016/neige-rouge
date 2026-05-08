// Pure Node.js PNG generator — no npm dependencies
// Generates icons-kitchen/ (blue chef hat) and icons-admin/ (black+gold gear)
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// ── PNG primitives ────────────────────────────────────────────────────────────

function uint32be(n) {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.from(uint32be(data.length));
  const crcBuf = Buffer.from(uint32be(crc32(Buffer.concat([typeBuf, data]))));
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function makePNG(w, h, drawFn) {
  // RGB pixel buffer
  const pix = new Uint8Array(w * h * 3);
  drawFn(pix, w, h);

  // Build raw PNG scanlines (filter byte 0 = None, then RGB rows)
  const rows = [];
  for (let y = 0; y < h; y++) {
    const row = Buffer.alloc(1 + w * 3);
    row[0] = 0;
    for (let x = 0; x < w; x++) {
      const s = (y * w + x) * 3;
      row[1 + x * 3] = pix[s];
      row[2 + x * 3] = pix[s + 1];
      row[3 + x * 3] = pix[s + 2];
    }
    rows.push(row);
  }

  const compressed = zlib.deflateSync(Buffer.concat(rows), { level: 6 });
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),             // PNG sig
    chunk('IHDR', Buffer.from([...uint32be(w), ...uint32be(h), 8, 2, 0, 0, 0])),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Drawing helpers ───────────────────────────────────────────────────────────

function setpx(pix, w, x, y, r, g, b) {
  if (x < 0 || y < 0 || x >= w) return;
  const i = (y * w + x) * 3;
  pix[i] = r; pix[i + 1] = g; pix[i + 2] = b;
}

function rect(pix, W, H, x0, y0, x1, y1, r, g, b) {
  for (let y = Math.max(0, y0); y < Math.min(H, y1); y++)
    for (let x = Math.max(0, x0); x < Math.min(W, x1); x++)
      setpx(pix, W, x, y, r, g, b);
}

function circle(pix, W, H, cx, cy, rad, r, g, b, aa = false) {
  const r2 = rad * rad;
  for (let y = Math.max(0, cy - rad - 1); y <= Math.min(H - 1, cy + rad + 1); y++) {
    for (let x = Math.max(0, cx - rad - 1); x <= Math.min(W - 1, cx + rad + 1); x++) {
      const d2 = (x - cx) ** 2 + (y - cy) ** 2;
      if (d2 <= r2) setpx(pix, W, x, y, r, g, b);
    }
  }
}

function roundedRect(pix, W, H, x0, y0, x1, y1, radius, r, g, b) {
  rect(pix, W, H, x0 + radius, y0, x1 - radius, y1, r, g, b);
  rect(pix, W, H, x0, y0 + radius, x1, y1 - radius, r, g, b);
  circle(pix, W, H, x0 + radius, y0 + radius, radius, r, g, b);
  circle(pix, W, H, x1 - radius, y0 + radius, radius, r, g, b);
  circle(pix, W, H, x0 + radius, y1 - radius, radius, r, g, b);
  circle(pix, W, H, x1 - radius, y1 - radius, radius, r, g, b);
}

// ── Kitchen icon: blue #1E40AF background + white chef-hat shape ──────────────

function drawKitchen(pix, W, H) {
  const BG = [30, 64, 175];   // #1E40AF blue
  const FG = [255, 255, 255]; // white

  // Background
  rect(pix, W, H, 0, 0, W, H, ...BG);

  const cx = Math.round(W * 0.5);

  // ── Hat dome (large circle, top-centre) ──────────────────────────────────
  const domeR = Math.round(W * 0.24);
  const domeCY = Math.round(H * 0.36);
  circle(pix, W, H, cx, domeCY, domeR, ...FG);

  // ── Hat body (rectangle connecting dome to brim) ──────────────────────────
  const bodyX0 = Math.round(W * 0.26);
  const bodyX1 = Math.round(W * 0.74);
  const bodyY0 = Math.round(H * 0.34);   // overlaps dome bottom
  const bodyY1 = Math.round(H * 0.56);
  rect(pix, W, H, bodyX0, bodyY0, bodyX1, bodyY1, ...FG);

  // ── Brim (wider, flat rectangle) ─────────────────────────────────────────
  const brimX0 = Math.round(W * 0.16);
  const brimX1 = Math.round(W * 0.84);
  const brimY0 = Math.round(H * 0.56);
  const brimY1 = Math.round(H * 0.68);
  rect(pix, W, H, brimX0, brimY0, brimX1, brimY1, ...FG);

  // ── Two horizontal stripes on hat body (decoration) ──────────────────────
  const stripe = Math.round(H * 0.025);
  const stripeGap = Math.round(H * 0.065);
  const stripeY = Math.round(H * 0.42);
  rect(pix, W, H, bodyX0 + 4, stripeY, bodyX1 - 4, stripeY + stripe, ...BG);
  rect(pix, W, H, bodyX0 + 4, stripeY + stripeGap, bodyX1 - 4, stripeY + stripeGap + stripe, ...BG);
}

// ── Admin icon: black background + gold #FACC15 gear ─────────────────────────

function drawAdmin(pix, W, H) {
  const BG = [0, 0, 0];           // black
  const GOLD = [250, 204, 21];    // #FACC15

  // Background
  rect(pix, W, H, 0, 0, W, H, ...BG);

  // ── Rounded-rect gold border frame ───────────────────────────────────────
  const borderW = Math.round(W * 0.07);
  const cornerR = Math.round(W * 0.12);
  // top/bottom bars
  rect(pix, W, H, cornerR, 0, W - cornerR, borderW, ...GOLD);
  rect(pix, W, H, cornerR, H - borderW, W - cornerR, H, ...GOLD);
  // left/right bars
  rect(pix, W, H, 0, cornerR, borderW, H - cornerR, ...GOLD);
  rect(pix, W, H, W - borderW, cornerR, W, H - cornerR, ...GOLD);
  // corners
  circle(pix, W, H, cornerR, cornerR, cornerR, ...GOLD);
  circle(pix, W, H, W - cornerR, cornerR, cornerR, ...GOLD);
  circle(pix, W, H, cornerR, H - cornerR, cornerR, ...GOLD);
  circle(pix, W, H, W - cornerR, H - cornerR, cornerR, ...GOLD);
  // punch out inner area of corners
  circle(pix, W, H, cornerR, cornerR, cornerR - borderW, ...BG);
  circle(pix, W, H, W - cornerR, cornerR, cornerR - borderW, ...BG);
  circle(pix, W, H, cornerR, H - cornerR, cornerR - borderW, ...BG);
  circle(pix, W, H, W - cornerR, H - cornerR, cornerR - borderW, ...BG);

  // ── Gear (centre of icon) ─────────────────────────────────────────────────
  const cx = Math.round(W * 0.5);
  const cy = Math.round(H * 0.5);
  const outerR = Math.round(W * 0.28);
  const ringR  = Math.round(W * 0.19);
  const holeR  = Math.round(W * 0.09);

  // Outer gear circle
  circle(pix, W, H, cx, cy, outerR, ...GOLD);

  // 8 rectangular teeth at 45° intervals
  const toothW = Math.round(W * 0.12);
  const toothH = Math.round(W * 0.1);
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const tx = Math.round(cx + Math.cos(angle) * (outerR - toothH / 2));
    const ty = Math.round(cy + Math.sin(angle) * (outerR - toothH / 2));
    // Axis-aligned rectangles (simplified gear teeth)
    rect(pix, W, H,
      tx - Math.round(toothW / 2), ty - Math.round(toothH / 2),
      tx + Math.round(toothW / 2), ty + Math.round(toothH / 2),
      ...GOLD);
  }

  // Inner ring cutout
  circle(pix, W, H, cx, cy, ringR, ...BG);

  // Centre hub
  circle(pix, W, H, cx, cy, holeR, ...GOLD);
}

// ── Generate all sizes ────────────────────────────────────────────────────────

const SIZES = [192, 512];

const configs = [
  {
    dir: path.join(__dirname, '..', 'public', 'icons-kitchen'),
    drawFn: drawKitchen,
    label: 'kitchen',
  },
  {
    dir: path.join(__dirname, '..', 'public', 'icons-admin'),
    drawFn: drawAdmin,
    label: 'admin',
  },
];

for (const { dir, drawFn, label } of configs) {
  fs.mkdirSync(dir, { recursive: true });

  for (const size of SIZES) {
    const buf = makePNG(size, size, drawFn);
    const file = path.join(dir, `icon-${size}.png`);
    fs.writeFileSync(file, buf);
    console.log(`✓ ${label} icon-${size}.png (${buf.length} bytes)`);
  }

  // maskable-512: same image, same size (OS applies safe-zone mask)
  const maskBuf = makePNG(512, 512, drawFn);
  const maskFile = path.join(dir, 'icon-maskable-512.png');
  fs.writeFileSync(maskFile, maskBuf);
  console.log(`✓ ${label} icon-maskable-512.png`);
}

console.log('\nAll icons generated successfully.');
