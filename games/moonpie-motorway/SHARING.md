# Leaderboard and race challenges

The leaderboard displays up to 25 verified Cup racers: a gold/silver/bronze podium for places 1–3, stronger row styling for places 4–10, and quieter rows for 11–25. The signed-in browser identity's personal best and Share my spot remain available even outside the top 25. Existing ranking and tie rules are unchanged.

All finished runs offer Challenge a friend. Saved results link to the public verified score; unsaved runs, unfinished Cups, and Cruise results are explicitly unranked and link to the game. Ranked captions state that rank is from the last check. Sharing takes a snapshot of the selected board or score so later data changes cannot mix up the caption and image.

Sharing options:
- Native link sharing for the device's available apps, including Messages where offered.
- Text-message, Facebook, WhatsApp, X, and email links; copy link and copy challenge caption plus link work on desktop and mobile.
- A square score card or full top-25 leaderboard graphic, including the visible game URL, available for download.
- Instagram / share image uses native file sharing when supported, otherwise downloads the image. A browser cannot force Instagram to appear in the share sheet or make it retain caption text. The UI explains copying the caption/link and adding a caption or Story link sticker.

Only user clicks initiate sharing. The site does not enumerate installed apps or post automatically. Native OS share-sheet targets and final social-app behavior require physical-device testing; automated tests simulate those adapters. Browser tests cover image files, downloads, top-25 tiers, personal ranks outside the top 25, unranked results, direct links, and mobile/desktop overflow. The separate full integration test verifies saved scores against a disposable local database.

All exported cards and Open Graph previews include the official Mardi Gras - Mobile, AL logo, packaged unchanged from `public/images/mardi-gras-mobile-logo.png`. The client waits for the local image before enabling image sharing; server previews embed the same asset directly instead of fetching the production site.
