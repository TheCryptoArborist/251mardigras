import type { PortraitOpening } from "./portrait-layout";

export function ribbonLayout(opening: Pick<PortraitOpening,"x"|"y"|"width"|"height">) {
  return {
    x: opening.x + opening.width / 2,
    y: opening.y + opening.height * .105,
    width: opening.width * .66,
    height: Math.max(44, opening.height * .075),
    rise: opening.height * .065,
    tail: opening.width * .045
  };
}

let ribbonLayer: HTMLCanvasElement | undefined;
export function drawPhraseRibbon(c: CanvasRenderingContext2D, phrase: string, opening: PortraitOpening) {
  if (!phrase) return;
  const layer = ribbonLayer ?? (ribbonLayer = document.createElement("canvas"));
  layer.width = layer.height = 1024;
  const p = layer.getContext("2d"); if (!p) return;
  const b = ribbonLayout(opening), left = b.x - b.width / 2, right = b.x + b.width / 2;
  const edge = b.y + b.rise;
  p.save(); p.lineJoin = "round"; p.lineWidth = 2.5;
  p.shadowColor = "#180722aa"; p.shadowBlur = 5; p.shadowOffsetY = 3;
  // Short folded ends stay within the portrait window.
  for (const side of [-1, 1]) {
    const x = side < 0 ? left : right;
    p.beginPath(); p.moveTo(x - side * 12, edge + 12);
    p.lineTo(x + side * b.tail, edge + 20);
    p.lineTo(x + side * (b.tail - 12), edge + b.height / 2 + 14);
    p.lineTo(x + side * b.tail, edge + b.height + 22);
    p.lineTo(x - side * 12, edge + b.height + 10); p.closePath();
    p.fillStyle = "#381344"; p.strokeStyle = "#dfb953"; p.fill(); p.stroke();
  }
  p.beginPath(); p.moveTo(left, edge);
  p.quadraticCurveTo(b.x, b.y - b.rise, right, edge);
  p.lineTo(right, edge + b.height);
  p.quadraticCurveTo(b.x, b.y - b.rise + b.height, left, edge + b.height); p.closePath();
  const fill = p.createLinearGradient(0, b.y, 0, edge + b.height);
  fill.addColorStop(0, "#6a2d80"); fill.addColorStop(.5, "#421650"); fill.addColorStop(1, "#290d38");
  p.fillStyle = fill; p.fill(); p.strokeStyle = "#f2cf72"; p.lineWidth = 3; p.stroke();
  p.shadowBlur = 0; p.shadowOffsetY = 0;
  const text = phrase.toUpperCase();
  let fontSize = Math.min(30, b.height * .57);
  p.font = `700 ${fontSize}px Georgia, serif`;
  const available = b.width - 36;
  if (p.measureText(text).width > available) {
    fontSize *= available / p.measureText(text).width;
    p.font = `700 ${fontSize}px Georgia, serif`;
  }
  const chars = [...text], widths = chars.map(ch => p.measureText(ch).width);
  let cursor = -widths.reduce((sum,w) => sum + w,0) / 2;
  p.textAlign = "center"; p.textBaseline = "middle"; p.fillStyle = "#fff0b6";
  chars.forEach((ch,i) => {
    const dx = cursor + widths[i] / 2;
    const y = b.y + b.height / 2 + b.rise * (2 * dx / b.width) ** 2;
    p.save(); p.translate(b.x + dx,y); p.rotate(Math.atan(8 * b.rise * dx / (b.width * b.width)));
    p.fillText(ch,0,0); p.restore(); cursor += widths[i];
  });
  p.restore();
  // Clip to the same window as the photo, preserving every frame's ornament.
  p.globalCompositeOperation = "destination-in"; p.drawImage(opening.mask,0,0);
  p.globalCompositeOperation = "source-over"; c.drawImage(layer,0,0);
}
