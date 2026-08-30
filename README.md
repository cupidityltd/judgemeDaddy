# ⚖️ The Excuse Court

A zero-backend, GitHub Pages-ready interactive courtroom game.

## What changed

This version no longer assumes every defendant is guilty.

The court now has:
- Multiple non-guilty outcomes
- Mercy and technicality verdicts
- Conditional rulings
- Romantic/couple cases with playful escape points
- Hug, kiss, ice-cream, compliment and snack settlements
- Three distinct judge personalities
- A large bank of varied judge reactions
- Judge-to-judge courtroom debates
- Sequential judge animations and gavel animations
- Shareable verdict text
- Downloadable PNG and SVG official court records

## Publish on GitHub Pages

1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, and `script.js`.
3. Commit to the main branch.
4. Go to **Settings → Pages**.
5. Select **Deploy from a branch**.
6. Choose `main` and `/ (root)`.
7. Save.

No build command is needed.

## Run locally

Open `index.html`, or run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Customize

All judge dialogue, verdicts, romantic escape points and debate exchanges are in `script.js`.

The visual theme is in `style.css`.

Typography:
- Fredericka the Great: titles, verdicts, certificate headings
- Special Elite: courtroom text and typewriter copy

## Certificate generation

Certificates are generated in the browser. PNG is rendered from an SVG onto Canvas, while SVG is downloaded directly. No server or database is required.
