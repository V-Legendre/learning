# 02 — TypeScript

## What Is TypeScript

TypeScript = JavaScript + static types. You write `.ts` files, the compiler checks types, then outputs plain `.js`. The browser never sees TypeScript.

## Variables & Primitives

| TypeScript | Python equivalent |
|-----------|-------------------|
| `string` | `str` |
| `number` | `int` and `float` combined (JS has no distinction) |
| `boolean` | `bool` |
| `null` | `None` |
| `undefined` | No equivalent — means "declared but no value assigned" |
| `any` | Like no type hint — avoid it |

- `const` = can't reassign (enforced). `let` = can reassign. Never use `var`.
- TypeScript **infers types** — annotate when it can't figure it out or for function signatures.

## Functions

```typescript
// Arrow function — the standard
const greet = (name: string, age: number): string => {
  return `Hello ${name}, you are ${age}`
}
```

- `?` for optional params: `(name: string, title?: string)`
- Backtick template literals: `` `Hello ${name}` `` = Python f-strings
- No keyword arguments — use objects instead

## Interfaces & Types

```typescript
interface User {
  name: string
  age: number
  email?: string  // optional
}

type Status = "active" | "inactive" | "pending"  // like Literal[...]
```

- **`interface`** for object shapes (extendable)
- **`type`** for unions, aliases, complex types
- TypeScript uses **structural typing** — shape matters, not the type name

## Arrays

```typescript
const names: string[] = ["Alice", "Bob"]
```

Key array methods (Python equivalents):
- `.map(fn)` → list comprehension `[fn(x) for x in list]`
- `.filter(fn)` → `[x for x in list if fn(x)]`
- `.reduce(fn, init)` → `functools.reduce`
- `.find(fn)` → `next((x for x in list if fn(x)), None)`

## Union Types & Narrowing

```typescript
let value: string | number = "hello"

if (typeof value === "string") {
  value.toUpperCase()  // TS knows it's string
}
```

## Generics

```typescript
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

Like Python's `Generic[T]` — parameterize types for reuse.

## Running TypeScript

```bash
pnpm dlx tsx basics.ts
```
