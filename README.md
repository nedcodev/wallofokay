# Wall of Okay

The website for [wallofokay.com](https://wallofokay.com): calm Notion templates for ADHD brains, guided by Hupp.

A plain static site (HTML, CSS and a little JavaScript). There is no build step and no backend.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: a note from Hupp, the free "Stuck right now?" helper, the Wall of Awful story, the Ask Hupp flow, the free Starter and all templates |
| `templates.html` | All templates, with filters |
| `low-tide.html` | Low Tide ($9) |
| `full-tide.html` | Full Tide ($24) |
| `404.html` | "This page fell off the wall" |

Shared files live in `assets/`: `site.css` (all styles), `site.js` (Buy buttons, Starter form, the "hup!" hop), `ask.js` (the Ask Hupp flow), `stuck.js` (the "Stuck right now?" helper; edit its list to change the tiny steps), plus the icons and share image. The logo files (long, square, app icon and Notion banner) are in `assets/logo/`.

## Connecting your accounts

Everything is in **one file: `assets/config.js`**. Paste your links between the quotes:

- **Gumroad**: each product's page link (for example `https://wallofokay.gumroad.com/l/lowtide`). Buy buttons then open Gumroad's checkout on top of the page.
- **Kit**: the form number from your Kit form's embed code. The free Starter form then adds people to that form.
- **Etsy**, **Instagram** and **Threads**: full links. They show up in the footer once set.

Until a link is added, the button shows a small "not connected yet" message instead of breaking.

## Going live with GitHub Pages

1. In this repo on GitHub, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
3. The `CNAME` file already says `wallofokay.com`. At your domain registrar, point the domain to GitHub Pages (four `A` records for `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a `CNAME` record for `www` pointing to `nedcodev.github.io`).
4. Back in **Settings → Pages**, tick **Enforce HTTPS** once it's available.

## Trying it on your computer

The pages use links that start with `/`, so open them through a small local server rather than double-clicking the file:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.
