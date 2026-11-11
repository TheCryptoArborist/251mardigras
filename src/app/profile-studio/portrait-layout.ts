export type PortraitOpening = {
  mask: HTMLCanvasElement;
  x: number;
  y: number;
  width: number;
  height: number;
};

// Select only the transparent window connected to the center. Openwork and
// transparent corners outside the frame remain separate from the portrait.
export function centralPortraitRegion(pixels: Uint8ClampedArray, width: number, height: number) {
  const region = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0;
  const start = Math.floor(height / 2) * width + Math.floor(width / 2);
  if (pixels[start * 4 + 3] > 32) throw new Error("Frame has no transparent portrait window");
  const add = (i: number) => {
    if (region[i] || pixels[i * 4 + 3] > 32) return;
    region[i] = 1; queue[tail++] = i;
  };
  add(start);
  let left = width, top = height, right = -1, bottom = -1;
  while (head < tail) {
    const i = queue[head++], x = i % width, y = Math.floor(i / width);
    left = Math.min(left, x); right = Math.max(right, x);
    top = Math.min(top, y); bottom = Math.max(bottom, y);
    if (x > 0) add(i - 1);
    if (x < width - 1) add(i + 1);
    if (y > 0) add(i - width);
    if (y < height - 1) add(i + width);
  }
  if (left === 0 || top === 0 || right === width - 1 || bottom === height - 1) {
    throw new Error("Frame portrait window is not enclosed");
  }
  return { region, x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
}

let classicOpening: PortraitOpening | undefined;
export function getClassicOpening(): PortraitOpening {
  if (classicOpening) return classicOpening;
  const mask = document.createElement("canvas"); mask.width = mask.height = 1024;
  const c = mask.getContext("2d"); if (!c) throw new Error("Canvas unavailable");
  c.fillStyle = "white"; c.beginPath(); c.arc(512, 512, 457, 0, Math.PI * 2); c.fill();
  classicOpening = { mask, x: 55, y: 55, width: 914, height: 914 };
  return classicOpening;
}

export function makePortraitOpening(frame: HTMLImageElement): PortraitOpening {
  const mask = document.createElement("canvas"); mask.width = mask.height = 1024;
  const c = mask.getContext("2d", { willReadFrequently: true });
  if (!c) throw new Error("Canvas unavailable");
  c.drawImage(frame, 12, 12, 1000, 1000);
  const pixels = c.getImageData(0, 0, 1024, 1024);
  const opening = centralPortraitRegion(pixels.data, 1024, 1024);
  const result = c.createImageData(1024, 1024);
  // Extend one pixel underneath the frame's opaque inner edge to hide seams.
  for (let y = opening.y; y < opening.y + opening.height; y++) {
    for (let x = opening.x; x < opening.x + opening.width; x++) {
      const i = y * 1024 + x;
      if (!opening.region[i]) continue;
      for (const neighbor of [i, i - 1, i + 1, i - 1024, i + 1024]) {
        const p = neighbor * 4;
        result.data[p] = result.data[p + 1] = result.data[p + 2] = result.data[p + 3] = 255;
      }
    }
  }
  c.clearRect(0, 0, 1024, 1024); c.putImageData(result, 0, 0);
  return { mask, x: opening.x, y: opening.y, width: opening.width, height: opening.height };
}

export function badgeCenterY(width: number, height: number) {
  // Reserve enough space for the badge's full rectangular bounds inside a
  // circular social profile crop, including a small allowance for its shadow.
  const halfWidth = width / 2 + 7;
  const lowerEdge = 512 + Math.sqrt(500 * 500 - halfWidth * halfWidth);
  return Math.min(935, lowerEdge - height / 2 - 8);
}
