// Loads .env for test runs (repositories/services under test read
// process.env.DATABASE_URL via the Prisma client singleton). Uses Node's
// built-in loader instead of adding a dotenv dependency.
try {
  process.loadEnvFile(".env");
} catch {
  // No .env present (e.g. CI without a local file) — DB-backed tests will
  // fail with a clear Prisma connection error instead of a silent skip.
}
