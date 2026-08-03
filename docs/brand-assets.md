# Brand Assets

The site expects the official Mardi Gras - Mobile, AL logo at:

```text
public/images/mardi-gras-mobile-logo.png
```

Use the official purple-and-gold tree logo provided by the Mardi Gras - Mobile, AL brand. The header and homepage now reference this file through `src/lib/brand.ts`.

Before merging or deploying a logo branch, confirm the file exists locally and is committed:

```powershell
New-Item -ItemType Directory -Force -Path "public\images" | Out-Null
Copy-Item "<path-to-logo-file>" "public\images\mardi-gras-mobile-logo.png"
git add public/images/mardi-gras-mobile-logo.png
git commit -m "Add official Mardi Gras Mobile logo asset"
```

Do not replace the logo with third-party artwork or generated variants. Use the official brand asset supplied by the project owner.
