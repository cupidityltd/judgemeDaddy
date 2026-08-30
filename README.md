# ⚖️ The Excuse Court

A playful, single-page GitHub Pages website where users submit an excuse, get judged by three animated judges, receive a final verdict, and generate a shareable/downloadable certificate.

## Features

- ✍️ Excuse submission with character counter
- ⚖️ Three judges with sequential entrance animations
- 🔨 Animated gavel reactions
- 📜 Randomized final verdicts
- 🏅 Official Excuse Certificate
- 🖼️ Download certificate as PNG
- 🧾 Download certificate as SVG
- 📋 Copy verdict to clipboard
- 📤 Native Web Share API support on compatible devices
- 📱 Responsive layout
- ✒️ Fredericka the Great + Special Elite typography
- 🚀 No build step required

## Run locally

Just open `index.html` in a browser.

For a local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, and `script.js`.
3. Commit the files.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select your main branch and `/ (root)`.
7. Save.
8. GitHub will give you the Pages URL.

No Node.js, React, npm, or build pipeline is required.

## Customize the judges

Open `script.js` and edit the `judges` array. Each judge has a set of possible responses.

## Customize the look

Open `style.css`. The main colors are defined at the top as CSS variables:

- `--ink`
- `--paper`
- `--red`
- `--cream`

The fonts are loaded from Google Fonts in `index.html`.

## Notes

The PNG certificate is generated entirely in the browser using SVG + Canvas, so no backend is required.

The share button uses the browser's Web Share API where available. On unsupported desktop browsers, it falls back to copying the verdict text.
