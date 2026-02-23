// ============================================
// TypeScript Basics — Practice File
// Run with: pnpm dlx tsx basics.ts
// ============================================

// --- Variables & Primitives ---

const name: string = "Alice"
let age: number = 30
const isActive: boolean = true

// Type inference — TS figures it out
const city = "Paris" // inferred as string
let count = 0 // inferred as number

// --- Functions ---

// Arrow function (standard in modern TS)
const greet = (name: string, age: number): string => {
  return `Hello ${name}, you are ${age}`
}

// Optional parameter (note the ?)
const formatName = (first: string, last?: string): string => {
  if (last) {
    return `${first} ${last}`
  }
  return first
}

// Default parameter (like Python defaults)
const repeat = (text: string, times: number = 3): string => {
  return text.repeat(times)
}

console.log(greet("Alice", 30))
console.log(formatName("Alice"))
console.log(formatName("Alice", "Smith"))
console.log(repeat("ha", 5))

// --- Interfaces ---

interface User {
  name: string
  age: number
  email?: string // optional
}

const alice: User = { name: "Alice", age: 30 }
const bob: User = { name: "Bob", age: 25, email: "bob@test.com" }

// This would error — missing required field:
// const bad: User = { name: "Charlie" }

// --- Arrays ---

const names: string[] = ["Alice", "Bob", "Charlie"]
const users: User[] = [alice, bob]

// Array methods (like Python list comprehensions but chained)
const upperNames = names.map((n) => n.toUpperCase()) // like [n.upper() for n in names]
const adults = users.filter((u) => u.age >= 30) // like [u for u in users if u.age >= 30]
const totalAge = users.reduce((sum, u) => sum + u.age, 0) // like sum(u.age for u in users)

console.log(upperNames)
console.log(adults)
console.log(totalAge)

// --- Union Types ---

type Status = "active" | "inactive" | "pending"

const userStatus: Status = "active"
// const bad: Status = "deleted"  // ERROR: not in the union

// Union with narrowing
const formatValue = (value: string | number): string => {
  if (typeof value === "string") {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

console.log(formatValue("hello")) // "HELLO"
console.log(formatValue(3.14159)) // "3.14"

// --- Type aliases for complex types ---

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

const handleResponse = (response: ApiResponse<User>): void => {
  if (response.success) {
    console.log(`Got user: ${response.data.name}`)
  } else {
    console.log(`Error: ${response.error}`)
  }
}

handleResponse({ success: true, data: alice })
handleResponse({ success: false, error: "Not found" })
