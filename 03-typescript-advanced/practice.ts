// =============================================================================
// TypeScript Advanced — Practice Exercises
// Run with: pnpm dlx tsx practice.ts
// =============================================================================

// ─── TYPES FOR EXERCISES ─────────────────────────────────────────────────────

type User = {
  id: number
  name: string
  email: string
  role: "admin" | "user" | "editor"
  preferences: {
    theme: "light" | "dark"
    notifications: boolean
  }
}

type Product = {
  id: string
  name: string
  price: number
  category: string
  inStock: boolean
}

type ApiResponse<T> = {
  data: T
  status: number
  message: string
  timestamp: string
}

// ─── EXERCISE 1: Object Destructuring ────────────────────────────────────────
// Extract name, email, and role from the user.
// Return a formatted string: "Alice (admin) — alice@example.com"

const formatUser = (user: User): string => {
  // TODO: Destructure user and return formatted string
  const { name, email, role } = user
  return `${name} (${role}) — ${email}`
}

// ─── EXERCISE 2: Nested Destructuring ────────────────────────────────────────
// Extract the user's name and theme from nested structure.
// Return: "Alice prefers dark mode"

const describePreference = (user: User): string => {
  // TODO: Use nested destructuring to get name and theme
  const { name, preferences: { theme } } = user
  return `${name} prefers ${theme} mode`
}

// ─── EXERCISE 3: Array Destructuring + Rest ──────────────────────────────────
// Given an array of scores, return the highest score and the remaining scores.
// Assume the array is sorted descending.

const splitScores = (scores: number[]): { best: number; rest: number[] } => {
  // TODO: Use array destructuring with rest
  const [best, ...rest] = scores
  return { best, rest }
}

// ─── EXERCISE 4: Destructuring in Function Parameters ────────────────────────
// Create a function that takes a product and returns a price label.
// Use destructuring directly in the parameter list.
// If inStock: "ProductName — $29.99"
// If not:     "ProductName — SOLD OUT"

const priceLabel = ({ name, price, inStock }: Product): string => {
  // TODO: Implement (destructuring already done for you in the signature)
  return inStock ? `${name} — $${price.toFixed(2)}` : `${name} — SOLD OUT`
}

// ─── EXERCISE 5: Spread for Immutable Object Update ─────────────────────────
// Update a user's email and set their role to "editor" without mutating original.

const promoteUser = (user: User, newEmail: string): User => {
  // TODO: Return a new User with updated email and role = "editor"
  return { ...user, email: newEmail, role: "editor" }
}

// ─── EXERCISE 6: Spread for Immutable Array Operations ──────────────────────
// Implement three array operations immutably:
// a) Add a product to the end
// b) Remove a product by id
// c) Update a product's price by id

const addProduct = (products: Product[], newProduct: Product): Product[] => {
  // TODO: Return new array with newProduct appended
  return [...products, newProduct]
}

const removeProduct = (products: Product[], id: string): Product[] => {
  // TODO: Return new array without the product matching id
  return products.filter(p => p.id !== id)
}

const updatePrice = (products: Product[], id: string, newPrice: number): Product[] => {
  // TODO: Return new array with the matching product's price updated
  return products.map(p => p.id === id ? { ...p, price: newPrice } : p)
}

// ─── EXERCISE 7: Rest in Destructuring (Property Removal) ───────────────────
// Remove the "role" property from a user, returning a new object without it.
// Use rest destructuring — NOT delete.

const withoutRole = (user: User): Omit<User, "role"> => {
  // TODO: Use rest destructuring to omit "role"
  const { role: _role, ...rest } = user
  return rest
}

// ─── EXERCISE 8: Spread for Nested State Update ─────────────────────────────
// Update a user's notification preference without mutating anything.

const toggleNotifications = (user: User): User => {
  // TODO: Return new user with notifications flipped
  return {
    ...user,
    preferences: {
      ...user.preferences,
      notifications: !user.preferences.notifications
    }
  }
}

// ─── EXERCISE 9: Async/Await with Error Handling ─────────────────────────────
// Simulate an API call that might fail.
// Use async/await with proper error handling.
// Return the data on success, or a fallback value on failure.

const simulateApi = async <T>(data: T, shouldFail: boolean): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  if (shouldFail) throw new Error("API request failed")
  return data
}

const fetchUserSafe = async (shouldFail: boolean): Promise<User | null> => {
  // TODO: Call simulateApi with a mock user.
  // Return the user on success, null on failure.
  // Log the error message if it fails.
  try {
    const user = await simulateApi<User>({
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      role: "admin",
      preferences: { theme: "dark", notifications: true }
    }, shouldFail)
    return user
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.log(`Error: ${msg}`)
    return null
  }
}

// ─── EXERCISE 10: Promise.all — Parallel Requests ───────────────────────────
// Fetch multiple resources in parallel. Return all results.
// If any fails, return what succeeded using Promise.allSettled.

type DashboardData = {
  users: User[]
  products: Product[]
  errors: string[]
}

const fetchDashboard = async (): Promise<DashboardData> => {
  // TODO: Use Promise.allSettled to fetch both, collect errors for failures
  const results = await Promise.allSettled([
    simulateApi<User[]>([{
      id: 1, name: "Alice", email: "a@b.com", role: "admin",
      preferences: { theme: "dark", notifications: true }
    }], false),
    simulateApi<Product[]>([{
      id: "p1", name: "Widget", price: 9.99, category: "tools", inStock: true
    }], false)
  ])

  const errors: string[] = []
  const users = results[0].status === "fulfilled" ? results[0].value : (errors.push("Failed to fetch users"), [] as User[])
  const products = results[1].status === "fulfilled" ? results[1].value : (errors.push("Failed to fetch products"), [] as Product[])

  return { users, products, errors }
}

// ─── EXERCISE 11: Utility Types ─────────────────────────────────────────────
// Create the following derived types (no implementation needed, just types):

// a) A type for creating a product (no id — the server generates it)
type CreateProductInput = Omit<Product, "id">

// b) A type for updating a product (id required, everything else optional)
type UpdateProductInput = Pick<Product, "id"> & Partial<Omit<Product, "id">>

// c) A type that maps product categories to arrays of products
type ProductCatalog = Record<string, Product[]>

// d) A readonly version of User (can't reassign any properties)
type ImmutableUser = Readonly<User>

// e) A type with only the display-relevant fields of Product
type ProductDisplayProps = Pick<Product, "name" | "price" | "inStock">

// ─── EXERCISE 12: Putting It All Together ───────────────────────────────────
// Build a mini "state manager": Given an initial state and an update,
// return the merged state. Use generics, spread, and utility types.

const mergeState = <T extends Record<string, unknown>>(
  current: T,
  update: Partial<T>
): T => {
  // TODO: Merge update into current immutably
  return { ...current, ...update }
}

// =============================================================================
// TEST RUNNER — validates your implementations
// =============================================================================

const test = (name: string, fn: () => boolean) => {
  try {
    const passed = fn()
    console.log(passed ? `  PASS  ${name}` : `  FAIL  ${name}`)
  } catch (e) {
    console.log(`  FAIL  ${name} — ${e instanceof Error ? e.message : e}`)
  }
}

const runTests = async () => {
  console.log("\n  TypeScript Advanced — Practice Tests\n")

  const mockUser: User = {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    role: "admin",
    preferences: { theme: "dark", notifications: true }
  }

  const mockProducts: Product[] = [
    { id: "p1", name: "Widget", price: 29.99, category: "tools", inStock: true },
    { id: "p2", name: "Gadget", price: 49.99, category: "electronics", inStock: false },
    { id: "p3", name: "Doohickey", price: 9.99, category: "tools", inStock: true },
  ]

  // Exercise 1
  test("formatUser", () =>
    formatUser(mockUser) === "Alice (admin) — alice@example.com"
  )

  // Exercise 2
  test("describePreference", () =>
    describePreference(mockUser) === "Alice prefers dark mode"
  )

  // Exercise 3
  test("splitScores", () => {
    const result = splitScores([95, 87, 82, 76])
    return result.best === 95 && result.rest.length === 3 && result.rest[0] === 87
  })

  // Exercise 4
  test("priceLabel — in stock", () =>
    priceLabel(mockProducts[0]) === "Widget — $29.99"
  )
  test("priceLabel — sold out", () =>
    priceLabel(mockProducts[1]) === "Gadget — SOLD OUT"
  )

  // Exercise 5
  test("promoteUser", () => {
    const result = promoteUser(mockUser, "new@example.com")
    return result.email === "new@example.com" &&
           result.role === "editor" &&
           mockUser.email === "alice@example.com" // original unchanged
  })

  // Exercise 6a
  test("addProduct", () => {
    const newP: Product = { id: "p4", name: "Thingamajig", price: 19.99, category: "misc", inStock: true }
    const result = addProduct(mockProducts, newP)
    return result.length === 4 && result[3].id === "p4" && mockProducts.length === 3
  })

  // Exercise 6b
  test("removeProduct", () => {
    const result = removeProduct(mockProducts, "p2")
    return result.length === 2 && result.every(p => p.id !== "p2")
  })

  // Exercise 6c
  test("updatePrice", () => {
    const result = updatePrice(mockProducts, "p1", 19.99)
    return result[0].price === 19.99 && mockProducts[0].price === 29.99
  })

  // Exercise 7
  test("withoutRole", () => {
    const result = withoutRole(mockUser)
    return !("role" in result) && result.name === "Alice"
  })

  // Exercise 8
  test("toggleNotifications", () => {
    const result = toggleNotifications(mockUser)
    return result.preferences.notifications === false &&
           mockUser.preferences.notifications === true // original unchanged
  })

  // Exercise 9
  test("fetchUserSafe — success", async () => {
    const result = await fetchUserSafe(false)
    return result !== null && result.name === "Alice"
  })
  test("fetchUserSafe — failure", async () => {
    const result = await fetchUserSafe(true)
    return result === null
  })

  // Exercise 10
  test("fetchDashboard", async () => {
    const result = await fetchDashboard()
    return result.users.length > 0 && result.products.length > 0 && result.errors.length === 0
  })

  // Exercise 12
  test("mergeState", () => {
    const state = { count: 0, name: "test", active: true }
    const result = mergeState(state, { count: 5, active: false })
    return result.count === 5 && result.name === "test" && result.active === false
  })

  console.log("")
}

runTests()
