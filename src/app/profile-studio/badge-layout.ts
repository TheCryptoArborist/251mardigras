import { badgeCenterY } from "./portrait-layout";

// Fit the entire trimmed logo inside the medallion, including its corners.
export function badgeLayout(width: number, height: number, size: number, backed: boolean) {
  const ratio = width / height;
  const shape = ratio > 1.2 ? Math.min(1.5, ratio) : ratio < .8 ? Math.max(.72, ratio) : 1;
  const outerWidth = backed ? size * Math.min(1, shape) : size * Math.min(1, ratio);
  const outerHeight = backed ? size / Math.max(1, shape) : size / Math.max(1, ratio);
  const scale = backed
    ? 1 / Math.hypot(width / (outerWidth - 24), height / (outerHeight - 24))
    : size / Math.max(width, height);
  return { outerWidth, outerHeight, width: width * scale, height: height * scale, y: badgeCenterY(outerWidth, outerHeight) };
}

export function drawBottomBadge(c: CanvasRenderingContext2D, image: HTMLCanvasElement, size: number, backed: boolean) {
  const b = badgeLayout(image.width, image.height, size, backed);
  c.save();
  c.shadowColor = "#12051fcc"; c.shadowBlur = 7; c.shadowOffsetY = 2;
  if (backed) {
    const rx = b.outerWidth / 2, ry = b.outerHeight / 2;
    const fill = c.createLinearGradient(0, b.y - ry, 0, b.y + ry);
    fill.addColorStop(0, "#4b2169"); fill.addColorStop(1, "#210c36");
    c.beginPath(); c.ellipse(512, b.y, rx, ry, 0, 0, Math.PI * 2);
    c.fillStyle = fill; c.fill();
    c.shadowBlur = 0; c.shadowOffsetY = 0;
    const gold = c.createLinearGradient(0, b.y - ry, 0, b.y + ry);
    gold.addColorStop(0, "#fff0ae"); gold.addColorStop(.5, "#deb443"); gold.addColorStop(1, "#a97820");
    c.strokeStyle = gold; c.lineWidth = 5; c.stroke();
    c.beginPath(); c.ellipse(512, b.y, rx - 7, ry - 7, 0, 0, Math.PI * 2);
    c.strokeStyle = "#e8c66b66"; c.lineWidth = 1; c.stroke();
  }
  c.drawImage(image, 512 - b.width / 2, b.y - b.height / 2, b.width, b.height);
  c.restore();
}
