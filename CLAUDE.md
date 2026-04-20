# Learning Project

## Purpose

This is a **learning repository** for frontend development. The user is an experienced engineer (7+ years in data engineering, DevOps/SRE, Python, SQL, PostgreSQL) who is a **complete beginner in frontend**.

## Current Learning Focus

- **Frontend development** with **React**
- **TypeScript** (never used before — teach from scratch alongside React)
- HTML, CSS, and modern web fundamentals

## Teaching Approach

1. **Concept first, then code**: Explain the concept clearly, then write code together to practice it.
2. **Quiz after each concept**: After teaching a concept, test understanding with **multiple-choice questions** using the `AskUserQuestion` tool (the interactive UI picker). Ask 3-4 questions at a time (the tool supports up to 4). After receiving answers, give feedback on any wrong answers with a brief explanation, then continue.
3. **Build on existing knowledge**: The user knows Python well — use Python analogies when explaining JS/TS concepts (e.g., "TypeScript interfaces are like Python dataclasses/TypedDicts").
4. **Don't over-simplify**: The user is senior in other domains. Be concise and technical — skip "what is a variable" level basics. Focus on what's *different* or *new* compared to Python/backend.

## Repo Structure

Organized **by topic**, with numbered folders for progression:

```
01-html-css/
02-typescript/
03-react-basics/
04-react-state/
...
```

Each topic folder should contain:
- A styled **HTML file** for concept notes and explanations (dark theme, visual diagrams, color-coded panels, side-by-side comparisons) — the user opens these in the browser. Do NOT use markdown READMEs for teaching content.
- Practice code files
- Exercises when applicable

## Tech Stack & Tools

- **Package manager**: pnpm
- **Language**: TypeScript (strict mode)
- **Framework**: React (latest, with functional components and hooks only)
- **Build tool**: Vite
- **Language of communication**: English

## Conventions

- Always use TypeScript, never plain JavaScript
- Use functional components only (no class components)
- Prefer named exports over default exports
- Use `const` by default, `let` when mutation is needed, never `var`
- Use arrow functions for component definitions and callbacks

## When Adding New Pages

Every new HTML page must be wired into the navigation and search system. Follow these steps:

1. **`index.html`** — Add a link to the new page in the appropriate section/topic card
2. **`pages.json`** — Add an entry with `path`, `title`, `section`, and `topic`. The array order defines prev/next navigation, so insert in the correct position
3. **`sw.js`** — Add the relative path to `PRECACHE_PATHS` so the page is cached for offline reading
4. **`<script src="../nav.js"></script>`** — Add this before `</body>` in the new HTML file (the nav bar and Cmd+K search are injected by this script)

### Key files

| File | Purpose |
|---|---|
| `nav.js` | Shared script — injects top bar (home, prev/next, search) and Cmd+K modal into every page |
| `pages.json` | Page manifest — ordered list of all pages with title/section/topic metadata |
| `sw.js` | Service worker — pre-caches all pages for offline PWA access. Bump `CACHE_NAME` version when updating |
| `manifest.json` | PWA manifest — uses relative paths (`./`) to work on GitHub Pages subpaths |
| `styles/notes.css` | Shared stylesheet — all note pages link to this |

### Learning tracks

- **Frontend** (`01-*` through `16-*`) — React/TypeScript learning path
- **Networking** (`net-01-*` through `net-13-*`) — Network fundamentals to K8s networking
- **Virtualization** (`virt-01-*` through `virt-10-*`) — CPU virtualization to Proxmox
- **Linux Storage** (`storage-01-*` through `storage-08-*`) — Block devices to LUKS/TPM and ZFS/btrfs

## What NOT to Do

- Don't write code without explaining the *why* first
- Don't introduce advanced patterns (Redux, SSR, Next.js) before fundamentals are solid
- Don't skip TypeScript type annotations — they're part of the learning
- Don't assume frontend knowledge — explain DOM, events, rendering, etc. from scratch
