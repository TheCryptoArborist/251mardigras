// Remove only near-white pixels connected to an outside edge. Enclosed white
// details remain part of the logo, rather than applying a global white key.
export function clearExteriorWhite(pixels: Uint8ClampedArray, width: number, height: number) {
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0;
  function enqueue(index: number) {
    if (visited[index]) return;
    visited[index] = 1;
    const p = index * 4;
    const lo = Math.min(pixels[p], pixels[p + 1], pixels[p + 2]);
    const hi = Math.max(pixels[p], pixels[p + 1], pixels[p + 2]);
    if (pixels[p + 3] < 16 || (lo >= 230 && hi - lo <= 24)) queue[tail++] = index;
  }
  for (let x = 0; x < width; x++) { enqueue(x); enqueue((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { enqueue(y * width); enqueue(y * width + width - 1); }
  while (head < tail) {
    const i = queue[head++], x = i % width, y = Math.floor(i / width);
    pixels[i * 4 + 3] = 0;
    if (x > 0) enqueue(i - 1);
    if (x < width - 1) enqueue(i + 1);
    if (y > 0) enqueue(i - width);
    if (y < height - 1) enqueue(i + width);
  }
}

const artworkCache = new Map<string, Promise<HTMLCanvasElement>>();
export function loadSocietyArtwork(src: string, removeWhite: boolean, circular = false) {
  const key = `${src}:${removeWhite}:${circular}`;
  let pending = artworkCache.get(key);
  if (!pending) {
    pending = new Promise<HTMLCanvasElement>((resolve, reject) => {
      const image = new Image();
      image.onerror = () => { artworkCache.delete(key); reject(new Error("Could not load society artwork")); };
      image.onload = () => {
        try {
          const source = document.createElement("canvas");
          source.width = image.naturalWidth; source.height = image.naturalHeight;
          const c = source.getContext("2d", { willReadFrequently: true });
          if (!c) throw new Error("Canvas unavailable");
          if (circular) {
            c.beginPath(); c.arc(source.width / 2, source.height / 2, Math.min(source.width, source.height) * 0.465, 0, Math.PI * 2); c.clip();
          }
          c.drawImage(image, 0, 0);
          const data = c.getImageData(0, 0, source.width, source.height);
          if (removeWhite) clearExteriorWhite(data.data, source.width, source.height);
          let left = source.width, top = source.height, right = -1, bottom = -1;
          for (let y = 0; y < source.height; y++) for (let x = 0; x < source.width; x++) {
            if (data.data[(y * source.width + x) * 4 + 3] > 16) {
              left = Math.min(left, x); right = Math.max(right, x);
              top = Math.min(top, y); bottom = Math.max(bottom, y);
            }
          }
          // Keep the source visible if a near-white-only image has no remaining art.
          if (right < left || bottom < top) { resolve(source); return; }
          c.putImageData(data, 0, 0);
          const trimmed = document.createElement("canvas");
          trimmed.width = right - left + 1; trimmed.height = bottom - top + 1;
          const target = trimmed.getContext("2d");
          if (!target) throw new Error("Canvas unavailable");
          target.drawImage(source, left, top, trimmed.width, trimmed.height, 0, 0, trimmed.width, trimmed.height);
          resolve(trimmed);
        } catch (error) { artworkCache.delete(key); reject(error); }
      };
      image.src = src;
    });
    artworkCache.set(key, pending);
  }
  return pending;
}
