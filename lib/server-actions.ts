"use server";

import { db } from "./db";
import { todos } from "./db/schema";
import { eq, like, or } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { Todo, TodoCategory } from "./types";
import "server-only";
import {
  getCachedTodos,
  setCachedTodos,
  clearCache,
  getCachedTodosByCategory,
} from "./db/cache";

// Load all todos from the database
export async function loadTodos(): Promise<Todo[]> {
  try {
    // Check cache first
    const cachedTodos = await getCachedTodos();
    if (cachedTodos) {
      console.log("Using cached todos");
      return cachedTodos;
    }

    console.log("Fetching todos from database");
    // Get all todos with proper ordering for better performance
    const data = db.select().from(todos).orderBy(todos.createdAt).all();

    const result = data.map((item) => formatTodoFromDb(item));

    // Cache the results
    await setCachedTodos(result);
    return result;
  } catch (error) {
    console.error("Error loading todos:", error);
    return [];
  }
}

// Load todos by category (for faster category page loading)
export async function loadTodosByCategory(
  category: TodoCategory
): Promise<Todo[]> {
  try {
    // Check category cache first
    const cachedTodos = await getCachedTodosByCategory(category);
    if (cachedTodos) {
      console.log(`Using cached todos for category ${category}`);
      return cachedTodos;
    }

    console.log(`Fetching todos for category ${category} from database`);
    // Force database read for fresh data
    const data = db
      .select()
      .from(todos)
      .where(eq(todos.category, category))
      .orderBy(todos.createdAt)
      .all();

    const result = data.map((item) => formatTodoFromDb(item));

    // We don't need to cache here as the full todos list should already be cached
    // when loadTodos is called, which updates all category caches as well

    return result;
  } catch (error) {
    console.error(`Error loading todos for category ${category}:`, error);
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
}): Promise<boolean> {
  try {
    const newTodo = {
      ...todo,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    db.insert(todos).values(newTodo).run();

    // Clear cache when data changes
    await clearCache();
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
): Promise<boolean> {
  try {
    db.update(todos).set(todo).where(eq(todos.id, id)).run();

    // Clear cache when data changes
    await clearCache();
    return true;
  } catch (error) {
    console.error("Error updating todo:", error);
    return false;
  }
}

// Delete a todo
export async function deleteTodo(id: string): Promise<boolean> {
  try {
    db.delete(todos).where(eq(todos.id, id)).run();

    // Clear cache when data changes
    await clearCache();
    return true;
  } catch (error) {
    console.error("Error deleting todo:", error);
    return false;
  }
}

// Toggle todo completion status
export async function toggleComplete(
  id: string,
  currentStatus: boolean
): Promise<boolean> {
  try {
    db.update(todos)
      .set({ completed: !currentStatus })
      .where(eq(todos.id, id))
      .run();

    // Clear cache when data changes
    await clearCache();
    return true;
  } catch (error) {
    console.error("Error toggling todo completion:", error);
    return false;
  }
}

// Search todos
export async function searchTodos(query: string): Promise<Todo[]> {
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
}): Todo {
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
