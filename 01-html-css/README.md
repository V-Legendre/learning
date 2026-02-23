# 01 — HTML & CSS Fundamentals

## How the Web Works (frontend perspective)

1. Browser requests a URL → gets back an **HTML** file
2. **HTML** = structure (what's on the page) — think of it as a config file that describes a UI
3. **CSS** = styling (how it looks) — a theme/skin layer
4. **JavaScript** = behavior (what it does) — the actual programming

## HTML: It's Just a Tree

HTML is a tree of **elements** (nodes). If you know XML or YAML, you already get the mental model.

```html
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello</h1>
    <p>A paragraph with <a href="/about">a link</a></p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </body>
</html>
```

Key concepts:
- **Elements** have an opening tag `<p>`, content, and a closing tag `</p>`
- Elements can **nest** (tree structure) — this tree is called the **DOM** (Document Object Model)
- **Attributes** are key-value pairs on the opening tag: `<a href="/about">` — like kwargs in Python
- `<head>` = metadata (title, stylesheets, scripts). Not visible on page.
- `<body>` = everything the user sees

## The Most Common HTML Elements

| Element | Purpose | Python analogy |
|---------|---------|---------------|
| `<div>` | Generic container/box | Like a plain `dict` — groups things |
| `<span>` | Inline container | Like wrapping text in a helper |
| `<h1>`–`<h6>` | Headings | — |
| `<p>` | Paragraph | — |
| `<a href="...">` | Link | — |
| `<button>` | Clickable button | — |
| `<input>` | Text field, checkbox, etc. | Like `input()` in Python |
| `<img src="...">` | Image (self-closing, no `</img>`) | — |
| `<ul>/<ol>` + `<li>` | Lists (unordered/ordered) | Like rendering a `list` |
| `<form>` | Groups inputs for submission | Like a request payload builder |

## Semantic vs Generic

HTML has **semantic** elements that describe *what* content is, not just how to group it:

- `<header>`, `<footer>`, `<nav>`, `<main>`, `<section>`, `<article>`
- These work exactly like `<div>` visually, but tell the browser (and screen readers) what the content *means*
- Think of it like using descriptive variable names vs `x`, `y`, `z`

---

## CSS: Styling the Tree

CSS works by **selecting** HTML elements and applying **properties** to them. It's a declarative rule engine: "for all elements matching X, apply styles Y."

### Three Ways to Apply CSS

1. **External file** (preferred) — `<link rel="stylesheet" href="styles.css">` in `<head>`
2. **`<style>` tag** — CSS directly in the HTML `<head>` (fine for learning)
3. **Inline** — `<p style="color: red;">` (avoid — mixes structure and style)

### CSS Syntax

```css
selector {
  property: value;
  property: value;
}
```

### Selectors — How You Target Elements

| Selector | Syntax | What it matches |
|----------|--------|----------------|
| Element | `p` | All `<p>` tags |
| Class | `.card` | All elements with `class="card"` |
| ID | `#header` | The one element with `id="header"` |
| Descendant | `nav a` | All `<a>` inside a `<nav>` |
| Direct child | `nav > a` | `<a>` that are direct children of `<nav>` |
| Multiple | `h1, h2, h3` | All three heading types |
| Pseudo-class | `a:hover` | `<a>` when mouse is over it |

**Classes vs IDs**: classes are reusable (like tags), IDs are unique (like primary keys). In practice, almost always use classes.

### The Box Model

Every element is a **box** with 4 layers (inside out):

```
┌─────────────── margin ────────────────┐
│  ┌──────────── border ─────────────┐  │
│  │  ┌───────── padding ────────┐   │  │
│  │  │        content           │   │  │
│  │  └──────────────────────────┘   │  │
│  └─────────────────────────────────┘  │
└───────────────────────────────────────┘
```

- **content** — the text/image itself
- **padding** — space between content and border (inside the box)
- **border** — the box edge
- **margin** — space outside the box (pushes other elements away)

Always use `box-sizing: border-box` so that `width` includes padding+border.

### Layout: Flexbox

Flexbox works on a **parent-child** relationship. The parent controls how its children are arranged.

```css
.container {
  display: flex;           /* activate flexbox on children */
  flex-direction: row;     /* row (horizontal) or column (vertical) */
  justify-content: center; /* alignment along main axis */
  align-items: center;     /* alignment along cross axis */
  gap: 16px;               /* space between children */
}
```

### Units

| Unit | Meaning |
|------|---------|
| `px` | Absolute pixels |
| `rem` | Relative to root font size (usually 16px). `2rem` = 32px |
| `%` | Relative to parent element |
| `vh`/`vw` | Viewport height/width (100vh = full screen height) |

Prefer `rem` for font sizes and spacing. Use `px` for borders and small details.
