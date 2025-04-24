"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TodoCard } from "@/components/todo-card";
import { useTodo } from "@/contexts/todo-context";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TodoForm } from "@/components/todo-form";
import { Todo, TodoCategory } from "@/lib/types";
import { loadTodosByCategory } from "@/lib/server-actions";
import { Loader } from "@/components/ui/loader";
import { SearchBar } from "@/components/ui/search-bar";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as TodoCategory;
  const {
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    getTodosByCategory,
    searchTodos,
  } = useTodo();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryTodos, setCategoryTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const todos = await loadTodosByCategory(category);
        setCategoryTodos(todos);
      } catch (error) {
        console.error("Error loading todos by category:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [category]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      // If search is cleared, load all todos for this category
      const todos = getTodosByCategory(category as TodoCategory) || [];
      setCategoryTodos(todos);
    } else {
      // Otherwise filter based on search criteria
      searchTodos(query).then((results) => {
        // Filter by category on client side since searchTodos doesn't take category
        const filteredResults = Array.isArray(results)
          ? results.filter((todo) => todo.category === category)
          : [];
        setCategoryTodos(filteredResults);
      });
    }
  };

  const handleAddTodo = async (todo: Omit<Todo, "id" | "createdAt">) => {
    // Add optimistic update
    const newTodo = {
      ...todo,
      id: `temp-${Date.now()}`,
      category: category as TodoCategory,
      completed: false,
      createdAt: new Date().toISOString(),
    } as Todo;

    setCategoryTodos((prevTodos) => [...prevTodos, newTodo]);

    // Actually add to database
    try {
      await addTodo({
        ...todo,
        category: category as TodoCategory,
      });

      // Refresh the list
      const updatedTodos = getTodosByCategory(category as TodoCategory) || [];
      setCategoryTodos(updatedTodos);
    } catch (error) {
      console.error("Error adding todo:", error);
      // Remove optimistic update if failed
      setCategoryTodos((prevTodos) =>
        prevTodos.filter((t) => t.id !== newTodo.id)
      );
    }

    setIsAddDialogOpen(false);
  };

  const handleUpdateTodo = async (todo: Omit<Todo, "id" | "createdAt">) => {
    if (!selectedTodo) return;

    // Optimistic update
    setCategoryTodos((prevTodos) =>
      prevTodos.map((t) => (t.id === selectedTodo.id ? { ...t, ...todo } : t))
    );

    // Actually update in database
    try {
      await updateTodo(selectedTodo.id, todo);
    } catch (error) {
      console.error("Error updating todo:", error);
      // Refresh from database if update failed
      const refreshedTodos = getTodosByCategory(category as TodoCategory) || [];
      setCategoryTodos(refreshedTodos);
    }

    setSelectedTodo(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteTodo = async (id: string) => {
    // Optimistic update
    setCategoryTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

    // Actually delete from database
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error("Error deleting todo:", error);
      // Refresh from database if delete failed
      const refreshedTodos = getTodosByCategory(category as TodoCategory) || [];
      setCategoryTodos(refreshedTodos);
    }
  };

  const handleToggleCompleteTodo = async (id: string) => {
    // First find the todo to get its current status
    const todo = categoryTodos.find((t) => t.id === id);
    if (!todo) return;

    // Optimistic update
    setCategoryTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

    // Actually toggle in database
    try {
      await toggleComplete(id);
    } catch (error) {
      console.error("Error toggling todo completion:", error);
      // Refresh from database if toggle failed
      const refreshedTodos = getTodosByCategory(category as TodoCategory) || [];
      setCategoryTodos(refreshedTodos);
    }
  };

  const openEditDialog = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsEditDialogOpen(true);
  };

  if (!category) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Invalid Category</h1>
      </div>
    );
  }

  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{formattedCategory} Tasks</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <SearchBar onSearch={handleSearch} placeholder="Search tasks..." />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="ml-4">
          Add Task
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader className="h-8 w-8" />
        </div>
      ) : categoryTodos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery.trim() !== ""
              ? "No tasks matching your search"
              : "No tasks in this category yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryTodos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TodoCard
                todo={todo}
                onDelete={() => handleDeleteTodo(todo.id)}
                onEdit={() => openEditDialog(todo)}
                onToggleComplete={() => handleToggleCompleteTodo(todo.id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0">
          <TodoForm
            initialData={{ category: category as TodoCategory }}
            onSubmit={handleAddTodo}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0">
          {selectedTodo && (
            <TodoForm
              initialData={selectedTodo}
              onSubmit={handleUpdateTodo}
              onCancel={() => setIsEditDialogOpen(false)}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
