"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import * as ServerActions from "@/lib/server-actions";
import { Todo, TodoCategory } from "@/lib/types";

interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, "id" | "createdAt">) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  getTodosByCategory: (category: TodoCategory) => Todo[];
  searchTodos: (query: string) => Promise<Todo[]>;
  loading: boolean;
  refresh: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load todos from database when component mounts
  useEffect(() => {
    refresh();
  }, []);

  // Memoize the refresh function to prevent unnecessary re-renders
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const todos = await ServerActions.loadTodos();
      setAllTodos(todos);
    } catch (error) {
      console.error("Error loading todos:", error);
      setAllTodos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimize addTodo with optimistic updates
  const addTodo = useCallback(
    async (todo: Omit<Todo, "id" | "createdAt">) => {
      try {
        // Create a temporary ID for optimistic update
        const tempId = `temp-${Date.now()}`;
        const tempTodo: Todo = {
          ...todo,
          id: tempId,
          createdAt: new Date().toISOString(),
        };

        // Update UI immediately (optimistic update)
        setAllTodos((prev) => [...prev, tempTodo]);

        // Call the server action
        const success = await ServerActions.addTodo(todo);

        // If successful, refresh the data to get the real ID
        if (success) {
          refresh();
        }
      } catch (error) {
        console.error("Error adding todo:", error);
        refresh(); // Fallback to refresh on error
      }
    },
    [refresh]
  );

  // Optimize updateTodo with optimistic updates
  const updateTodo = useCallback(
    async (id: string, todo: Partial<Todo>) => {
      try {
        // Apply update optimistically
        setAllTodos((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...todo } : item))
        );

        // Call the server action
        await ServerActions.updateTodo(id, todo);
      } catch (error) {
        console.error("Error updating todo:", error);
        refresh(); // Fallback to refresh on error
      }
    },
    [refresh]
  );

  // Optimize deleteTodo with optimistic updates
  const deleteTodo = useCallback(
    async (id: string) => {
      try {
        // Remove the item optimistically
        setAllTodos((prev) => prev.filter((todo) => todo.id !== id));

        // Call the server action
        await ServerActions.deleteTodo(id);
      } catch (error) {
        console.error("Error deleting todo:", error);
        refresh(); // Fallback to refresh on error
      }
    },
    [refresh]
  );

  // Optimize toggleComplete with optimistic updates
  const toggleComplete = useCallback(
    async (id: string) => {
      try {
        const todo = allTodos.find((t) => t.id === id);
        if (todo) {
          // Toggle optimistically
          setAllTodos((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, completed: !item.completed } : item
            )
          );

          // Call the server action
          await ServerActions.toggleComplete(id, todo.completed);
        }
      } catch (error) {
        console.error("Error toggling todo completion:", error);
        refresh(); // Fallback to refresh on error
      }
    },
    [allTodos, refresh]
  );

  // Memoize the filter function to avoid recalculation
  const getTodosByCategory = useCallback(
    (category: TodoCategory) => {
      return allTodos.filter((todo) => todo.category === category);
    },
    [allTodos]
  );

  const searchTodos = useCallback(
    async (query: string) => {
      try {
        // For better performance, search locally if query is short
        if (query.length < 3) {
          const lowerQuery = query.toLowerCase();
          return allTodos.filter(
            (todo) =>
              todo.title.toLowerCase().includes(lowerQuery) ||
              todo.description.toLowerCase().includes(lowerQuery)
          );
        }

        // Otherwise, use server search
        return await ServerActions.searchTodos(query);
      } catch (error) {
        console.error("Error searching todos:", error);
        return [];
      }
    },
    [allTodos]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      todos: allTodos,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleComplete,
      getTodosByCategory,
      searchTodos,
      loading,
      refresh,
    }),
    [
      allTodos,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleComplete,
      getTodosByCategory,
      searchTodos,
      loading,
      refresh,
    ]
  );

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    console.error("useTodo must be used within a TodoProvider");
    // Return default values instead of throwing an error for better resilience
    return {
      todos: [],
      addTodo: async () => {},
      updateTodo: async () => {},
      deleteTodo: async () => {},
      toggleComplete: async () => {},
      getTodosByCategory: () => [],
      searchTodos: async () => [],
      loading: false,
      refresh: async () => {},
    } as TodoContextType;
  }
  return context;
}
