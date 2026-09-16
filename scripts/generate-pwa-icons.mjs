// 一時スクリプト: PWA 用アイコン（PNG）を生成する
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const hex = (value) => [
  parseInt(value.slice(1, 3), 16),
  parseInt(value.slice(3, 5), 16),
  parseInt(value.slice(5, 7), 16),
];

const TOP = hex('#1a5570');
const BOTTOM = hex('#0b2c3c');
const WHITE = hex('#f7f3e9');
const VERMILION = hex('#c8452f');

const mix = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const SS = 4;

function draw(size, { maskable }) {
  const inner = Math.round(size * SS);
  const buffer = Buffer.alloc(inner * inner * 4);

  // maskable はセーフゾーンに収めるため中身を縮小する
  const scale = maskable ? 0.66 : 0.88;
  const cx = 0.5;
  const cy = 0.5;
  const radius = 0.5 * scale;

  const sunCenter = { x: cx + radius * 0.42, y: cy - radius * 0.52 };
  const sunRadius = radius * 0.30;
  const inkAccent = { x: cx - radius * 0.62, y: cy - radius * 0.50 };
  const accentRadius = radius * 0.13;

  const waves = [
    { y: cy + radius * 0.10, amp: radius * 0.085, thick: radius * 0.11, alpha: 1 },
    { y: cy + radius * 0.48, amp: radius * 0.085, thick: radius * 0.10, alpha: 0.78 },
    { y: cy + radius * 0.82, amp: radius * 0.085, thick: radius * 0.09, alpha: 0.55 },
  ];
  const waveLeft = cx - radius * 1.06;
  const waveRight = cx + radius * 1.06;
  const freq = 1.6;

  const cornerRadius = maskable ? 0 : 0.2;

  for (let y = 0; y < inner; y++) {
    for (let x = 0; x < inner; x++) {
      const u = (x + 0.5) / inner;
      const v = (y + 0.5) / inner;

      let out = mix(TOP, BOTTOM, v);

      // 角丸の外側は透明にする
      if (cornerRadius > 0) {
        const r = cornerRadius;
        const dx = Math.max(u < r ? r - u : u > 1 - r ? u - (1 - r) : 0, 0);
        const dy = Math.max(v < r ? r - v : v > 1 - r ? v - (1 - r) : 0, 0);
        if (dx * dx + dy * dy > r * r) {
          const offset = (y * inner + x) * 4;
          buffer[offset] = 0;
          buffer[offset + 1] = 0;
          buffer[offset + 2] = 0;
          buffer[offset + 3] = 0;
          continue;
        }
      }

      let layer = null;
      let alpha = 0;

      for (const wave of waves) {
        if (u < waveLeft || u > waveRight) continue;
        const phase = ((u - waveLeft) / (waveRight - waveLeft)) * freq * Math.PI * 2;
        const center = wave.y + Math.sin(phase) * wave.amp;
        if (Math.abs(v - center) <= wave.thick / 2) {
          layer = WHITE;
          alpha = wave.alpha;
        }
      }

      const distSun = Math.hypot(u - sunCenter.x, v - sunCenter.y);
      if (distSun <= sunRadius) {
        layer = VERMILION;
        alpha = 1;
      }

      const distAccent = Math.hypot(u - inkAccent.x, v - inkAccent.y);
      if (distAccent <= accentRadius) {
        layer = WHITE;
        alpha = 0.92;
      }

      if (layer) out = mix(out, layer, alpha);

      const offset = (y * inner + x) * 4;
      buffer[offset] = Math.round(out[0]);
      buffer[offset + 1] = Math.round(out[1]);
      buffer[offset + 2] = Math.round(out[2]);
      buffer[offset + 3] = 255;
    }
  }

  // スーパーサンプリングで縮小
  const output = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const offset = ((y * SS + sy) * inner + (x * SS + sx)) * 4;
          r += buffer[offset];
          g += buffer[offset + 1];
          b += buffer[offset + 2];
          a += buffer[offset + 3];
        }
      }
      const count = SS * SS;
      const offset = (y * size + x) * 4;
      output[offset] = Math.round(r / count);
      output[offset + 1] = Math.round(g / count);
      output[offset + 2] = Math.round(b / count);
      output[offset + 3] = Math.round(a / count);
    }
  }

  return output;
}

const targets = [
  { path: 'public/icons/icon-192.png', size: 192, maskable: false },
  { path: 'public/icons/icon-512.png', size: 512, maskable: false },
  { path: 'public/icons/icon-maskable-512.png', size: 512, maskable: true },
  { path: 'public/icons/icon-maskable-192.png', size: 192, maskable: true },
  { path: 'public/apple-touch-icon.png', size: 180, maskable: true },
];

for (const target of targets) {
  const file = resolve(ROOT, target.path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, encodePng(target.size, target.size, draw(target.size, target)));
  console.log(`generated ${target.path} (${target.size}x${target.size})`);
}
