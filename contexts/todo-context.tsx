"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

  const refresh = async () => {
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
  };

  const addTodo = async (todo: Omit<Todo, "id" | "createdAt">) => {
    try {
      await ServerActions.addTodo(todo);
      refresh();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const updateTodo = async (id: string, todo: Partial<Todo>) => {
    try {
      await ServerActions.updateTodo(id, todo);
      refresh();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await ServerActions.deleteTodo(id);
      refresh();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const todo = allTodos.find((t) => t.id === id);
      if (todo) {
        await ServerActions.toggleComplete(id, todo.completed);
        refresh();
      }
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
  };

  const getTodosByCategory = (category: TodoCategory) => {
    return allTodos.filter((todo) => todo.category === category);
  };

  const searchTodos = async (query: string) => {
    try {
      return await ServerActions.searchTodos(query);
    } catch (error) {
      console.error("Error searching todos:", error);
      return [];
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos: allTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        getTodosByCategory,
        searchTodos,
        loading,
        refresh,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}
