"use server";

import { db } from "./db";
import { todos } from "./db/schema";
import { eq, like, or } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { Todo, TodoCategory } from "./types";
import "server-only";

// Load all todos from the database
export async function loadTodos(): Promise<Todo[]> {
  try {
    // Get all todos
    const data = db.select().from(todos).all();
    return data.map((item) => formatTodoFromDb(item));
  } catch (error) {
    console.error("Error loading todos:", error);
    return [];
  }
}

// Add a new todo to the database
export async function addTodo(todo: {
  title: string;
  description: string;
  completed: boolean;
  category: TodoCategory;
  dueDate?: string;
}) {
  try {
    const newTodo = {
      ...todo,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    db.insert(todos).values(newTodo).run();
    return true;
  } catch (error) {
    console.error("Error adding todo:", error);
    return false;
  }
}

// Update an existing todo
export async function updateTodo(
  id: string,
  todo: {
    title?: string;
    description?: string;
    completed?: boolean;
    category?: TodoCategory;
    dueDate?: string;
  }
) {
  try {
    db.update(todos).set(todo).where(eq(todos.id, id)).run();
    return true;
  } catch (error) {
    console.error("Error updating todo:", error);
    return false;
  }
}

// Delete a todo
export async function deleteTodo(id: string) {
  try {
    db.delete(todos).where(eq(todos.id, id)).run();
    return true;
  } catch (error) {
    console.error("Error deleting todo:", error);
    return false;
  }
}

// Toggle todo completion status
export async function toggleComplete(id: string, currentStatus: boolean) {
  try {
    db.update(todos)
      .set({ completed: !currentStatus })
      .where(eq(todos.id, id))
      .run();
    return true;
  } catch (error) {
    console.error("Error toggling todo completion:", error);
    return false;
  }
}

// Search todos
export async function searchTodos(query: string) {
  try {
    const lowerQuery = `%${query.toLowerCase()}%`;
    const results = db
      .select()
      .from(todos)
      .where(
        or(like(todos.title, lowerQuery), like(todos.description, lowerQuery))
      )
      .all();

    return results.map((item) => formatTodoFromDb(item));
  } catch (error) {
    console.error("Error searching todos:", error);
    return [];
  }
}

// Helper function to convert database todo to app Todo format
function formatTodoFromDb(dbTodo: {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  createdAt: string;
  dueDate: string | null;
}) {
  return {
    id: dbTodo.id,
    title: dbTodo.title,
    description: dbTodo.description,
    completed: dbTodo.completed,
    category: dbTodo.category as TodoCategory,
    createdAt: dbTodo.createdAt,
    dueDate: dbTodo.dueDate || undefined,
  };
}
