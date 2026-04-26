import { createWriteStream } from 'fs';
import { deflateSync } from 'zlib';

function createPNG(size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const t = Buffer.from(type, 'ascii');
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const crc = crc32(Buffer.concat([t, data]));
    const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc >>> 0);
    return Buffer.concat([len, t, data, crcBuf]);
  }

  function crc32(buf) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    return (c ^ 0xFFFFFFFF);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Brand colors: bg #1a0a2e, lightning bolt #863bff
  const bg = [26, 10, 46];
  const accent = [134, 59, 255];
  const light = [180, 140, 255];

  const raw = [];
  const cx = size / 2, cy = size / 2;
  const pad = size * 0.15;

  for (let y = 0; y < size; y++) {
    raw.push(0); // filter type
    for (let x = 0; x < size; x++) {
      // Rounded rect background via distance
      const rx = size * 0.18, ry = size * 0.18;
      const dx = Math.max(0, Math.abs(x - cx) - (size / 2 - rx - pad));
      const dy = Math.max(0, Math.abs(y - cy) - (size / 2 - ry - pad));
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > rx) {
        // Outside rounded rect = transparent (white bg for splash)
        raw.push(255, 255, 255);
        continue;
      }

      // Lightning bolt shape (simplified)
      // Top half: from (60%, 15%) to (40%, 50%)
      // Bottom half: from (60%, 50%) to (35%, 85%)
      const nx = (x - pad) / (size - 2 * pad); // 0..1
      const ny = (y - pad) / (size - 2 * pad); // 0..1

      // Bolt polygon check (simplified as two triangles)
      let isBolt = false;

      // Top triangle: points roughly (0.55,0.1), (0.3,0.55), (0.6,0.55)
      const bx1 = 0.55, by1 = 0.08;
      const bx2 = 0.25, by2 = 0.54;
      const bx3 = 0.62, by3 = 0.54;

      // Bottom triangle: points (0.62,0.46), (0.38,0.46), (0.45,0.92)
      const bx4 = 0.62, by4 = 0.46;
      const bx5 = 0.38, by5 = 0.46;
      const bx6 = 0.45, by6 = 0.92;

      function sign(px, py, ax, ay, bx, by) {
        return (px - bx) * (ay - by) - (ax - bx) * (py - by);
      }
      function inTri(px, py, ax, ay, bx2, by2, cx2, cy2) {
        const d1 = sign(px, py, ax, ay, bx2, by2);
        const d2 = sign(px, py, bx2, by2, cx2, cy2);
        const d3 = sign(px, py, cx2, cy2, ax, ay);
        const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
        return !(hasNeg && hasPos);
      }

      if (inTri(nx, ny, bx1, by1, bx2, by2, bx3, by3) ||
          inTri(nx, ny, bx4, by4, bx5, by5, bx6, by6)) {
        isBolt = true;
      }

      if (isBolt) {
        // Gradient: lighter at top
        const t = ny;
        raw.push(
          Math.round(accent[0] + (light[0] - accent[0]) * (1 - t)),
          Math.round(accent[1] + (light[1] - accent[1]) * (1 - t)),
          Math.round(accent[2] + (light[2] - accent[2]) * (1 - t)),
        );
      } else {
        // Subtle radial gradient on bg
        const dist2 = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / (size * 0.7);
        const factor = Math.max(0, 1 - dist2 * 0.4);
        raw.push(
          Math.round(bg[0] * (0.8 + 0.4 * factor)),
          Math.round(bg[1] * (0.8 + 0.4 * factor)),
          Math.round(bg[2] * (0.8 + 0.4 * factor)),
        );
      }
    }
  }

  const rawBuf = Buffer.from(raw);
  const compressed = deflateSync(rawBuf, { level: 9 });
  const idat = chunk('IDAT', compressed);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, chunk('IHDR', ihdr), idat, iend]);
}

for (const size of [192, 512]) {
  const png = createPNG(size);
  const ws = createWriteStream(`public/icon-${size}.png`);
  ws.write(png);
  ws.end();
  console.log(`Generated public/icon-${size}.png (${png.length} bytes)`);
}
