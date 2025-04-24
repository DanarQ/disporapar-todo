"use server";

import { Todo } from "../types";

// Simple in-memory cache for database results
type CacheEntry = {
  data: Todo[];
  timestamp: number;
};

type CacheStore = {
  allTodos?: CacheEntry;
  todosByCategory: {
    [category: string]: CacheEntry;
  };
};

// Cache configuration
const CACHE_TTL = 2000; // Cache time-to-live in milliseconds (2 seconds)

// In-memory cache
const cache: CacheStore = {
  todosByCategory: {},
};

/**
 * Get cached todos or null if cache is invalid
 */
export async function getCachedTodos(): Promise<Todo[] | null> {
  if (!cache.allTodos) return null;

  // Check if cache is still valid
  const now = Date.now();
  if (now - cache.allTodos.timestamp > CACHE_TTL) {
    return null;
  }

  return cache.allTodos.data;
}

/**
 * Set todos in cache
 */
export async function setCachedTodos(todos: Todo[]): Promise<void> {
  cache.allTodos = {
    data: todos,
    timestamp: Date.now(),
  };

  // Also update category caches
  const categories = ["kepemudaan", "olahraga", "pariwisata"];

  // Update each category cache
  categories.forEach((category) => {
    const categoryTodos = todos.filter((todo) => todo.category === category);
    cache.todosByCategory[category] = {
      data: categoryTodos,
      timestamp: Date.now(),
    };
  });
}

/**
 * Get cached todos by category or null if cache is invalid
 */
export async function getCachedTodosByCategory(
  category: string
): Promise<Todo[] | null> {
  if (!cache.todosByCategory[category]) return null;

  // Check if cache is still valid
  const now = Date.now();
  if (now - cache.todosByCategory[category].timestamp > CACHE_TTL) {
    return null;
  }

  return cache.todosByCategory[category].data;
}

/**
 * Clear all cache entries
 */
export async function clearCache(): Promise<void> {
  cache.allTodos = undefined;
  cache.todosByCategory = {};
}
