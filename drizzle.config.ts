import dotenv from "dotenv"
import type { Config } from "drizzle-kit"

dotenv.config({ path: ".env.local" })

export default {
  schema: "./drizzle/schema.ts",
  driver: "mysql2",
  out: "./drizzle",
  dbCredentials: {
    uri: process.env.DATABASE_URL!,
  },
  breakpoints: true,
} satisfies Config
