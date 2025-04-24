import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export type TodoCategory = "kepemudaan" | "olahraga" | "pariwisata";

export const todos = sqliteTable("todos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  category: text("category", {
    enum: ["kepemudaan", "olahraga", "pariwisata"],
  }).notNull(),
  createdAt: text("created_at").notNull(),
  dueDate: text("due_date"),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = Omit<typeof todos.$inferInsert, "id" | "createdAt">;
