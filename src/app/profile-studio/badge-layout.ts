import { badgeCenterY } from "./portrait-layout";

// Fit the entire trimmed logo inside the medallion, including its corners.
export function badgeLayout(width: number, height: number, size: number, backed: boolean, frameRadius=500, offsetX=0, offsetY=0) {
  const ratio = width / height;
  const shape = ratio > 1.2 ? Math.min(1.5, ratio) : ratio < .8 ? Math.max(.72, ratio) : 1;
  const outerWidth = backed ? size * Math.min(1, shape) : size * Math.min(1, ratio);
  const outerHeight = backed ? size / Math.max(1, shape) : size / Math.max(1, ratio);
  const scale = backed
    ? 1 / Math.hypot(width / (outerWidth - 24), height / (outerHeight - 24))
    : size / Math.max(width, height);
  const halfWidth=outerWidth/2+14,halfHeight=outerHeight/2+14;
  const maxX=Math.sqrt(frameRadius*frameRadius-halfHeight*halfHeight)-halfWidth;
  const dx=Math.max(-maxX,Math.min(maxX,offsetX));
  const maxY=Math.sqrt(frameRadius*frameRadius-(Math.abs(dx)+halfWidth)**2)-halfHeight;
  const defaultY=badgeCenterY(outerWidth,outerHeight,frameRadius)-512;
  const dy=Math.max(-maxY,Math.min(maxY,defaultY+offsetY));
  return { outerWidth, outerHeight, width: width * scale, height: height * scale, x:512+dx,y:512+dy };
}

export type BadgeBackground = "purple" | "gold" | "none";

export function drawBottomBadge(c: CanvasRenderingContext2D, image: HTMLCanvasElement, size: number, background: BadgeBackground, frameRadius=500, offsetX=0, offsetY=0) {
  const backed = background !== "none";
  const b = badgeLayout(image.width, image.height, size, backed, frameRadius,offsetX,offsetY);
  c.save();
  c.shadowColor = "#12051fcc"; c.shadowBlur = 7; c.shadowOffsetY = 2;
  if (backed) {
    const rx = b.outerWidth / 2, ry = b.outerHeight / 2;
    const fill = c.createLinearGradient(0, b.y - ry, 0, b.y + ry);
    fill.addColorStop(0, background === "gold" ? "#fff0ae" : "#4b2169");
    fill.addColorStop(1, background === "gold" ? "#d3a339" : "#210c36");
    c.beginPath(); c.ellipse(b.x, b.y, rx, ry, 0, 0, Math.PI * 2);
    c.fillStyle = fill; c.fill();
    c.shadowBlur = 0; c.shadowOffsetY = 0;
    // Use a bold, solid opposite-color rim so it reads at avatar size.
    c.strokeStyle = background === "gold" ? "#4b2169" : "#e8c364";
    c.lineWidth = 10; c.stroke();
  }
  // A subtle edge separates artwork from either backing color.
  if (backed) { c.shadowColor = background === "gold" ? "#4b2169" : "#fff0bc"; c.shadowBlur = 2; }
  c.drawImage(image, b.x - b.width / 2, b.y - b.height / 2, b.width, b.height);
  c.restore();
}
