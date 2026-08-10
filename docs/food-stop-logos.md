# Food Stop Logo Assets

The Food and Drink navigator supports local logo images for each downtown stop. Logo assets should be placed in:

```text
public/images/food-stops/
```

Use square images when possible because the card layout displays them inside a small square logo frame. PNG files with transparent backgrounds are ideal, but JPG files are also supported when they match the expected filenames below.

## Expected filenames

- `the-outsider.png` — The Outsider
- `greers-saint-louis-market.png` — Greer's Saint Louis Market
- `ellenjay-bakery.jpg` — ellenJAY Bakery
- `bake-my-day.jpg` — Bake My Day
- `guncles-gluten-free.jpg` — Guncles Gluten Free
- `big-bad-breakfast.jpg` — Big Bad Breakfast
- `serdas-coffee-co.jpg` — Serda's Coffee Co.
- `knuckle-bones-elixir-co.jpg` — Knuckle Bones Elixir Co.
- `great-day-latte.jpg` — Great Day Latte
- `moes-original-bbq.jpg` — Moe's Original BBQ
- `cammies-old-dutch-ice-cream-shoppe.jpg` — Cammie's Old Dutch Ice Cream Shoppe
- `loda-bier-garten.jpg` — LODA Bier Garten
- `post.jpg` — POST
- `braided-river-brewing-company.jpg` — Braided River Brewing Company
- `joe-cain-cafe.jpg` — Joe Cain Cafe
- `bobs-downtown-restaurant.jpg` — Bob's Downtown Restaurant
- `pops-midtown.jpg` — Pop's Midtown
- `lemon-ts.jpg` — Lemon T's

## Local copy command pattern

Example:

```powershell
New-Item -ItemType Directory -Force -Path "public\images\food-stops" | Out-Null
Copy-Item "D:\Mardi Gras\Food Logos\bake-my-day.jpg" "public\images\food-stops\bake-my-day.jpg" -Force
```

## Behavior

If the file exists at the expected path, the food stop card displays the logo.

If the file is missing or fails to load, the card falls back to the text initials badge so the page remains usable.

## Curation note

Use approved, public, or owner-provided logo assets. Do not hotlink restaurant logos from third-party pages because those image URLs can break, change, or disappear.
