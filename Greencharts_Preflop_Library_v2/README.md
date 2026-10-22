# Greencharts — Preflop Chart Library

Static site for GitHub Pages. No dependencies or build step are required.

## Publish on GitHub Pages
1. Upload `index.html`, `style.css`, `app.js`, and `charts.json` to the root of `Zeezoo777/Greencharts`.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
4. When GitHub Pages finishes publishing, it will show the public site URL in that same section.

## Range data
The interface intentionally does not invent ranges. `charts.json` contains all situation IDs with empty data. To provide a chart, add action entries under its ID, using `R` for Raise, `C` for Call, and `F` for Fold. Hands use standard notation: `AA`, `AKs`, `AKo`.

Example:
```json
"rfi_utg": {
  "AA": "R",
  "AKs": "R",
  "AKo": "R",
  "72o": "F"
}
```

**Current limitation:** this is a public, static viewer, not a secure in-site admin panel. `charts.json` is edited through GitHub by repository collaborators with write permission, then the site redeploys. Do not put passwords or secrets in static front-end files. An authenticated editor with shared database storage requires a backend service to be connected and configured.
