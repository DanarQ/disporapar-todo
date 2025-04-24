import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import "server-only";

// Initialize SQLite database with performance optimizations
const sqlite = new Database(path.resolve("./disporapar.db"), {
  // Keep the connection open between requests
  fileMustExist: false,
  // Increase timeout for slow operations
  timeout: 5000,
});

// Run optimizations for better performance
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("synchronous = NORMAL");
sqlite.pragma("cache_size = 1000");
sqlite.pragma("temp_store = MEMORY");
sqlite.pragma("mmap_size = 30000000000");

// Export the database instance
export const db = drizzle(sqlite);
