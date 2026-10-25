# Itayo portfolio: plain HTML/CSS/JS (no build step)
- Edit content in `data.js`. Edit colours/fonts in the top of `styles.css`.
- Put images in `images/` and reference them in `data.js`. Add `images/og.jpg` (1200x630) for link previews.
- Update the URLs in the `<head>` of `index.html` (og:url, og:image) to your real domain.

## Deploy to Vercel
1. Create a GitHub repo and push this folder (`git init && git add . && git commit -m "portfolio" && git push`).
2. Go to vercel.com > Add New > Project > import the repo. Framework preset: **Other**. Leave build settings empty. Click Deploy.
   (No GitHub? Run `npx vercel` in this folder.)
3. Custom domain: Project > Settings > Domains > Add your domain.
   - Apex domain (yourname.com): add an **A record** `76.76.21.21` at your registrar.
   - www: add a **CNAME** `www` pointing to `cname.vercel-dns.com`.
   Vercel shows the exact records and issues HTTPS automatically (propagation: minutes to 48h).
4. Every `git push` redeploys the site.

## Receive form messages without an email app (optional)
Create a free form at formspree.io or web3forms.com, then replace the submit handler in `main.js` with a `fetch()` POST to your form endpoint.
