# Food Stop Logo Assets

The Food and Drink navigator supports local logo images for each downtown stop. Logo assets should be placed in:

```text
public/images/food-stops/
```

Use PNG files with transparent backgrounds when possible. Square images work best because the card layout displays them inside a small square logo frame.

## Expected filenames

- `the-outsider.png` — The Outsider
- `greers-saint-louis-market.png` — Greer's Saint Louis Market
- `ellenjay-bakery.png` — ellenJAY Bakery
- `bake-my-day.png` — Bake My Day
- `guncles-gluten-free.png` — Guncles Gluten Free
- `big-bad-breakfast.png` — Big Bad Breakfast
- `serdas-coffee-co.png` — Serda's Coffee Co.
- `knuckle-bones-elixir-co.png` — Knuckle Bones Elixir Co.
- `great-day-latte.png` — Great Day Latte
- `moes-original-bbq.png` — Moe's Original BBQ
- `cammies-old-dutch-ice-cream-shoppe.png` — Cammie's Old Dutch Ice Cream Shoppe
- `loda-bier-garten.png` — LODA Bier Garten
- `post.png` — POST
- `braided-river-brewing-company.png` — Braided River Brewing Company
- `joe-cain-cafe.png` — Joe Cain Cafe
- `bobs-downtown-restaurant.png` — Bob's Downtown Restaurant
- `pops-midtown.png` — Pop's Midtown
- `lemon-ts.png` — Lemon T's

## Local copy command pattern

Example:

```powershell
New-Item -ItemType Directory -Force -Path "public\images\food-stops" | Out-Null
Copy-Item "D:\Mardi Gras\Food Logos\bake-my-day.png" "public\images\food-stops\bake-my-day.png" -Force
```

## Behavior

If the file exists at the expected path, the food stop card displays the logo.

If the file is missing or fails to load, the card falls back to the text initials badge so the page remains usable.

## Curation note

Use approved, public, or owner-provided logo assets. Do not hotlink restaurant logos from third-party pages because those image URLs can break, change, or disappear.
