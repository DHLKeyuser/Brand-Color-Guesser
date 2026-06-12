# Logo Color Guess

A mobile-first, dark-themed quiz game. You're shown a famous brand logo as a
neutral silhouette and asked to guess its **official brand color** using a color
picker or a HEX input. Each round is scored **0–10** based on how close your
guess is to the real color (using a perceptual color-distance formula). Play 10
rounds, beat your best score, and share your result.

Built with **HTML, CSS, and vanilla JavaScript only** — no build step, no
frameworks. It's a fully static site that runs great on GitHub Pages.

## Features

- One logo at a time, shown as a silhouette so the color isn't given away.
- Guess with a **color picker** and/or a **HEX input** (the two stay in sync).
- **0–10 score per round** based on perceptual color distance.
- Round progress indicator (e.g. `3/10`) and running total score.
- Result panel comparing **"Your selection"** vs **"Original"** with swatches and HEX values.
- **Next** button to advance, plus a final summary screen.
- **Share** button (uses the native share sheet where available, otherwise copies the result text to the clipboard).
- **Best score saved** in `localStorage` (persists on your device).
- **45 brands** included (well over the 30 minimum).

## Project structure

```
.
├── index.html          # markup
├── style.css           # dark, mobile-first styling
├── script.js           # game logic + embedded brand data
├── assets/
│   └── logos/          # local SVG logo files (one per brand)
├── scripts/
│   └── extract-logos.js  # one-off helper used to generate the logo assets
└── README.md
```

## Run locally

Because the app loads SVG files with `fetch()`, you should serve it over HTTP
rather than opening `index.html` directly with the `file://` protocol (browsers
block `fetch` of local files under `file://`).

Pick any one of these from the project root:

```bash
# Python 3
python3 -m http.server 8000

# Node (no install: uses npx)
npx serve .

# PHP
php -S localhost:8000
```

Then open <http://localhost:8000> in your browser.

## Host on GitHub Pages

1. Push this repository to GitHub.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select your branch (e.g. `main`) and the `/ (root)` folder, then **Save**.
5. Wait a moment, then visit the published URL
   (`https://<your-username>.github.io/<your-repo>/`).

No build step is required — the files are served as-is.

## Logo assets, source & license

All logo SVGs in `assets/logos/` come from **[Simple Icons](https://simpleicons.org)**
(repository: <https://github.com/simple-icons/simple-icons>). The brand HEX
colors used as the "correct" answers are the official brand colors that Simple
Icons publishes alongside each icon.

- **Simple Icons license:** the icon set is released under
  [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)
  (public domain dedication), so the icons can be redistributed freely.
- The logos were copied into this repo using `scripts/extract-logos.js`
  (which reads the `simple-icons` npm package). They are stored **locally** and
  are **not hotlinked** from any external server.

You may regenerate / extend the local assets with:

```bash
npm install simple-icons
node scripts/extract-logos.js   # writes SVGs into assets/logos/ and prints brand data
```

### Attribution & trademark reminder

> Brand names, logos, and colors are trademarks of their respective owners.
> They are used here for **identification and educational/illustrative purposes
> only** (a guessing game) and do **not** imply any affiliation with or
> endorsement by the brands. While the Simple Icons artwork is CC0, the
> underlying **trademarks remain the property of their respective owners**.
> If you reuse or extend this project, please respect each brand's trademark
> and brand-usage guidelines.

If you add logos from other public archives (e.g.
[SVGRepo](https://www.svgrepo.com), [Wikimedia Commons](https://commons.wikimedia.org),
or similar), store them locally in `assets/logos/`, avoid hotlinking, and add
the appropriate attribution/license note here.

## How scoring works

Your guess and the real color are compared using the
["redmean" weighted RGB distance](https://en.wikipedia.org/wiki/Color_difference#sRGB),
a cheap approximation of perceived color difference. That distance is mapped to
a `0–10` score per round (closer = higher). Over 10 rounds the maximum total is
`100`, and your accuracy percentage is `total / 100`.
