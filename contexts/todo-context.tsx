"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Category = "kepemudaan" | "olahraga" | "pariwisata";

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: Category;
  createdAt: Date;
  dueDate?: Date;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, "id" | "createdAt">) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  getTodosByCategory: (category: Category) => Todo[];
  searchTodos: (query: string) => Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Rapat koordinasi program kepemudaan",
    description:
      "Rapat dengan Kepala Bidang Kepemudaan tentang program tahun 2025",
    completed: false,
    category: "kepemudaan",
    createdAt: new Date("2025-04-20"),
    dueDate: new Date("2025-04-27"),
  },
  {
    id: "2",
    title: "Persiapan lomba olahraga tingkat provinsi",
    description:
      "Koordinasi dengan pelatih dan pemilihan atlet untuk lomba bulan depan",
    completed: true,
    category: "olahraga",
    createdAt: new Date("2025-04-15"),
    dueDate: new Date("2025-04-30"),
  },
  {
    id: "3",
    title: "Penyusunan proposal festival budaya",
    description: "Menyusun proposal dan anggaran untuk festival budaya tahunan",
    completed: false,
    category: "pariwisata",
    createdAt: new Date("2025-04-18"),
    dueDate: new Date("2025-04-25"),
  },
  {
    id: "4",
    title: "Evaluasi program pelatihan pemuda",
    description: "Mengevaluasi hasil pelatihan kepemimpinan pemuda tahun 2024",
    completed: false,
    category: "kepemudaan",
    createdAt: new Date("2025-04-10"),
    dueDate: new Date("2025-04-24"),
  },
  {
    id: "5",
    title: "Survei lokasi destinasi wisata baru",
    description:
      "Melakukan survei dan penilaian potensi wisata di daerah utara",
    completed: false,
    category: "pariwisata",
    createdAt: new Date("2025-04-12"),
    dueDate: new Date("2025-05-10"),
  },
];

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load initial data
  useEffect(() => {
    setTodos(initialTodos);
  }, []);

  const addTodo = (todo: Omit<Todo, "id" | "createdAt">) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const updateTodo = (id: string, todo: Partial<Todo>) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...todo } : t)));
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const getTodosByCategory = (category: Category) => {
    return todos.filter((todo) => todo.category === category);
  };

  const searchTodos = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(lowerQuery) ||
        todo.description.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        getTodosByCategory,
        searchTodos,
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
