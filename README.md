# blog.gmora.work

Personal blog built with [Hugo](https://gohugo.io) (extended, v0.168.0) and a small theme that lives directly in `layouts/`.

```bash
hugo server                       # preview at http://localhost:1313
hugo new posts/my-post/index.md   # new post (a folder, so images go next to it)
```

Pushing to `main` builds and publishes the site through `.github/workflows/deploy.yml` (GitHub Pages, source: GitHub Actions).
How to write posts (front matter, callouts, tabs, math, wikilinks) is in [`content/cheatsheets/writing-on-this-blog.md`](content/cheatsheets/writing-on-this-blog.md).

## Layout

| Path | What |
| --- | --- |
| `hugo.toml` | Site settings: author, footer links, menu, home sections |
| `content/` | Everything published: `posts/`, `cheatsheets/`, home intro in `_index.md` |
| `archive/` | Notes kept in the repo but never published |
| `layouts/` | Templates: `baseof`, `home`, `list`, `single`, `_partials/`, `_shortcodes/` |
| `layouts/_markup/` | Render hooks: callouts, heading anchors, images, math |
| `assets/css/main.css` | All styles; colours and fonts are the variables at the top |
| `assets/css/syntax.css` | Code colours, generated with `hugo gen chromastyles --style=catppuccin-mocha` |
| `assets/js/main.js` | Copy button, reading progress, table of contents highlight |
| `assets/images/avatar.png` | Avatar on the home page and in link previews |
| `static/` | Copied as is: `CNAME`, `favicon.png` |
