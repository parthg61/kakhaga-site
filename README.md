# Ka Kha Ga website

Static site for kakhaga.co.in (a cleaned, optimised export of the original Framer site).

## Layout
- `public/` is the whole website and the only thing that gets published.
- `hosting/` holds config for other hosts (`.htaccess` for Apache, `netlify.toml`). Not needed on Cloudflare Pages, which reads `public/_headers`.
- `serve.py` is a local preview server.

## Deploy (Cloudflare Pages, automatic)
Pushing to `main` publishes the site. Cloudflare project settings: **no build command, output directory `public`**.

## Run locally
```bash
python3 serve.py   # http://localhost:8767
```

---
Older notes (paths below are relative to `public/`):


Static export of the Ka Kha Ga Framer site (integrated communications agency), cleaned up and ready to deploy.

## Run locally
```bash
python3 serve.py   # http://localhost:8767
```
`serve.py` mimics the Netlify rewrite so `/collection/<slug>` deep links work.

## Deploy
Drag this folder onto Netlify, or connect the repo. `netlify.toml` sets caching headers and the blog-article rewrite.

## Notes
- Edit content in Framer, re-export, then re-apply the fixes below (or edit the files here directly).
- Title/description are set in `index.html` **and** in `framerusercontent.com/sites/*/shared-lib.*.mjs` (Framer re-applies them on load).
- Changes from the raw export: flattened layout, real page title/description, `lang="en"`, apostrophe typo fix, blog deep-link shell, resized images, responsive CSS safety net (`#kkg-responsive`), and a Framer bundle patch (`framer.*.mjs`: words up to 24 letters stay unbreakable; Framer's default of 12 split words like "communication" mid-word).
- Open items: services 05/06 share one description; add `canonical` + `sitemap.xml` once the domain is known; images need alt text (set in Framer).

## Scroll-driven process chart
`kkg-process.js` pins the Discovery / Strategy / Create & Build / Scale & Optimize chart, fills each bar in turn as you scroll and fades its description in, then releases the page. It is skipped for `prefers-reduced-motion`. Tweak `NAV` (header height) and `HOLD` at the top of the file. The "Made in Framer" badge is hidden via `#kkg-nobadge` in `index.html`.

## Going live (shared hosting / FTP)
Upload the **contents** of this folder (not the folder itself) into the site's web root, usually `public_html`. `.htaccess` carries the hosting config (module MIME types, blog-link rewrite, caching); make sure hidden files are shown in the FTP client. Exclude `.git`, `serve.py`, `README.md` and `netlify.toml`. Prefer SFTP/FTPS over plain FTP if the host offers it.
