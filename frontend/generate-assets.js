import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a 256x256 PNG for logo.png and favicon.ico matching ARKALOKA copper bronze colors
const width = 256;
const height = 256;

// Create raw RGBA buffer
const buffer = Buffer.alloc(width * height * 4);

function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = (y * width + x) * 4;
    buffer[idx] = r;
    buffer[idx + 1] = g;
    buffer[idx + 2] = b;
    buffer[idx + 3] = a;
}

function drawTriangle(p1, p2, p3, colorFunc) {
    const minX = Math.max(0, Math.floor(Math.min(p1[0], p2[0], p3[0])));
    const maxX = Math.min(width - 1, Math.ceil(Math.max(p1[0], p2[0], p3[0])));
    const minY = Math.max(0, Math.floor(Math.min(p1[1], p2[1], p3[1])));
    const maxY = Math.min(height - 1, Math.ceil(Math.max(p1[1], p2[1], p3[1])));

    function edge(a, b, c) {
        return (c[0] - a[0]) * (b[1] - a[1]) - (c[1] - a[1]) * (b[0] - a[0]);
    }

    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const pt = [x + 0.5, y + 0.5];
            const w0 = edge(p2, p3, pt);
            const w1 = edge(p3, p1, pt);
            const w2 = edge(p1, p2, pt);

            if ((w0 >= 0 && w1 >= 0 && w2 >= 0) || (w0 <= 0 && w1 <= 0 && w2 <= 0)) {
                const [r, g, b, a] = colorFunc(x, y);
                setPixel(x, y, r, g, b, a);
            }
        }
    }
}

// Polygons for ARKALOKA triangle
const leftLeg = [[50, 210], [128, 46], [158, 77], [94, 210]];
const rightLeg = [[128, 46], [206, 210], [170, 210], [128, 118]];
const rightShadow = [[206, 210], [170, 210], [188, 172]];
const baseFold = [[50, 210], [144, 210], [120, 164], [94, 210]];
const innerFold = [[120, 164], [144, 210], [128, 118]];

// Fill polygons
drawTriangle(leftLeg[0], leftLeg[1], leftLeg[2], () => [140, 83, 62, 255]);
drawTriangle(leftLeg[0], leftLeg[2], leftLeg[3], () => [179, 118, 82, 255]);

drawTriangle(rightLeg[0], rightLeg[1], rightLeg[2], () => [198, 138, 102, 255]);
drawTriangle(rightLeg[0], rightLeg[2], rightLeg[3], () => [179, 118, 82, 255]);

drawTriangle(rightShadow[0], rightShadow[1], rightShadow[2], () => [62, 35, 25, 255]);

drawTriangle(baseFold[0], baseFold[1], baseFold[2], () => [158, 103, 71, 255]);
drawTriangle(baseFold[0], baseFold[2], baseFold[3], () => [140, 83, 62, 255]);

drawTriangle(innerFold[0], innerFold[1], innerFold[2], () => [115, 66, 44, 255]);

function createPNG(w, h, rgbaBuf) {
    const rawRows = Buffer.alloc(h * (w * 4 + 1));
    for (let y = 0; y < h; y++) {
        rawRows[y * (w * 4 + 1)] = 0; // Filter type 0 (None)
        rgbaBuf.copy(rawRows, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
    }

    const compressed = zlib.deflateSync(rawRows);

    function crc32(buf) {
        let crc = -1;
        for (let i = 0; i < buf.length; i++) {
            crc ^= buf[i];
            for (let j = 0; j < 8; j++) {
                crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
            }
        }
        return (crc ^ -1) >>> 0;
    }

    function chunk(type, data) {
        const len = Buffer.alloc(4);
        len.writeUInt32BE(data.length, 0);
        const t = Buffer.from(type, 'ascii');
        const crc = Buffer.alloc(4);
        crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
        return Buffer.concat([len, t, data, crc]);
    }

    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8;  // bit depth
    ihdr[9] = 6;  // color type RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace

    return Buffer.concat([
        signature,
        chunk('IHDR', ihdr),
        chunk('IDAT', compressed),
        chunk('IEND', Buffer.alloc(0))
    ]);
}

const pngBuffer = createPNG(width, height, buffer);
const publicDir = path.join(__dirname, 'public');

fs.writeFileSync(path.join(publicDir, 'logo.png'), pngBuffer);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), pngBuffer);
fs.copyFileSync(path.join(publicDir, 'logo.svg'), path.join(publicDir, 'favicon.svg'));

console.log('Successfully generated logo.png, logo.svg, favicon.svg, favicon.ico');
