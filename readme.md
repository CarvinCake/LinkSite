# carvincake link page

Personal link page for carvincake, live at carvincake.com. It is a single static page in a lo-fi zine / photocopier style, built with Vite and plain JavaScript (no framework).

## Files

- `index.html`: markup
- `src/style.css`: all styles
- `src/main.js`: interactions. Click to stamp marks; after 13 marks they explode into pixel-art bursts. A scrolling tape shows randomized and live lines. Stickers spin with momentum; the Kinoradar ticket tears its stub off before navigating.
- `public/`: fonts, favicons, `CNAME`

## Scripts

```bash
npm install
npm start           # Vite dev server on port 8000, host 0.0.0.0
npm run build       # production build into dist/
npm run preview     # serve the built dist/ locally
npm run deploy      # zip dist/ to dist.zip and scp it to the server
npx eslint src      # lint
```

## Deployment

`npm run deploy` uploads `dist.zip` to the server. Then, on the server, run:

```bash
cd /../../var/www/carvincake.com/ && unzip -o dist.zip && sudo systemctl restart nginx.service
```

This unpacks the new build over the site directory and restarts nginx.

There is also a GitHub Actions workflow, `.github/workflows/deploy.yml`, which builds the project and publishes `dist` to GitHub Pages on every push to `master`.
