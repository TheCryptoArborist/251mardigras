# MoonPie Motorway art overhaul

Original artwork generated with the built-in image-generation tool, then losslessly encoded as WebP for the game. No Pole Position II assets are redistributed. Its rear-view open-wheel racer, small player-car scale, circuit curbs, and pixel-rendered scenery were used as visual references.

## Final game assets

- `dist/assets/race-cars-v3.webp` — six rear-view open-wheel sprites in a 3 × 2 atlas. Purple/gold player car in left, straight, and right steering poses; gold, ivory, and dark-purple rivals.
- `dist/assets/carnival-scenery-v2.webp` — nine transparent roadside sprites in a 3 × 3 atlas: brick building, stucco building, live oak, grandstand, float, tall oak, pit tent, crowd barrier, and ornate streetlamp.
- `dist/assets/mobile-skyline-v2.webp` — a 3:1 Mobile skyline panorama with textured clouds and Carnival lighting.
- `dist/art.js` — atlas extraction, consistent tire baselines, backdrop layers, verge details, and checkered gantry artwork.

## Generation prompt briefs

1. Detailed 1988/early-1990s arcade open-wheel single-seat race cars, elevated rear camera, purple/gold/ivory liveries, exposed suspension and slick tires, three matched player steering poses and three rivals, six isolated cells on transparent alpha, clustered pixel shading and no green.
2. Detailed Mobile Mardi Gras roadside props, 16-bit pixel shading, natural masonry and ironwork textures, Spanish moss, grounded float undercarriage, crowds in purple/gold/ivory, consistent baselines and nine isolated transparent cells; no labels or green.
3. Panoramic distant Mobile skyline, lavender afternoon sky with gold/ivory textured clouds, RSA tower crown, stepped Riverview roof, twin cathedral steeples, historical buildings and harbor details, no road, cars, text, UI or foreground props.

The billboard artwork and the 45-record parade data snapshot remain unchanged. Sprite artwork loads before the game becomes playable so placeholder scenery does not flash on screen.

The v3 car atlas corrects the helmet direction in all six frames: solid gold rear shells with purple center stripes replace the camera-facing dark visor bands. Generated as an edit of the original atlas and encoded as lossless WebP; the 1536 × 1024 atlas and existing frame extraction remain compatible.
