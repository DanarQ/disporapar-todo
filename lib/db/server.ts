"use server";

import { db } from "./index";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";
import "server-only";

// Run migrations on application startup (create tables)
export async function runMigrations() {
  try {
    console.log("Running database migrations...");
    migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }
}

// Keeping an empty function to avoid breaking imports
export async function seedDatabase() {
  // Do nothing - let users add their own todos
  return;
}
