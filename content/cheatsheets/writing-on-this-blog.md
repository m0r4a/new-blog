---
title: "Writing on this blog"
date: 2026-10-21
description: "How to write and publish a post here: front matter, callouts, tabs, math, links and images."
tags: [meta]
---

Everything is plain Markdown. Write, `git push`, and the site rebuilds itself on GitHub Pages.

## New post

```bash
hugo new posts/my-post/index.md   # a folder per post, so images live next to it
hugo server                       # preview at http://localhost:1313
git add . && git commit -m "New post" && git push
```

A cheatsheet goes in `content/cheatsheets/` instead. Creating the folder by hand (from Obsidian or nvim) works the same as `hugo new`.

## Front matter

```yaml
---
title: "My post"
date: 2026-10-21        # recommended: without it, the last commit that changed the file is used
tags: [prometheus, slo]  # optional
description: "One line for link previews."  # optional
draft: true              # optional: hides it from the published site
toc: false               # optional: hides "On this page"
---
```

Don't repeat the title as a `# Heading` in the body: the page prints it already. Sections start at `##`.

## Callouts

Obsidian and GitHub syntax, so they look right in the editor too:

```markdown
> [!note] Optional title
> Text of the note.

> [!warning]- Collapsed by default
> Click to open.
```

> [!tip] Types
> `note`, `info`, `abstract`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`.

## Tabs

```markdown
{{</* tabs */>}}
{{</* tab "Bash" */>}}
Markdown here, code blocks included.
{{</* /tab */>}}
{{</* tab "Zsh" */>}}
Another tab.
{{</* /tab */>}}
{{</* /tabs */>}}
```

## Math

Inline `$E = mc^2$` and blocks:

```markdown
$$
SLO = \frac{good}{valid}
$$
```

Rendered at build time: $SLO = \frac{good}{valid}$.

## Links

```markdown
[normal link](https://prometheus.io)
[[slos]]                     another page, by file or folder name
[[slos|the SLO post]]        with custom text
[[slos#4. The Maths]]        to a heading
```

A `[[link]]` to a page that doesn't exist yet shows as plain text, not a broken link.

## Images

Put the image in the post's folder and reference it either way:

```markdown
![Grafana panel](panel.png)
![[panel.png]]
```

## Code

Fenced blocks with a language get highlighting and a copy button:

````markdown
```promql
sum by (service) (rate(http_requests_total[5m]))
```
````

## What isn't published

`archive/` (notes, journal, books, projects) stays in the repo but never reaches the site. Move a file into `content/` to publish it.
