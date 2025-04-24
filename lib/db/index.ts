import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import "server-only";

// Initialize SQLite database
const sqlite = new Database(path.resolve("./disporapar.db"));
export const db = drizzle(sqlite);
