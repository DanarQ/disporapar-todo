"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { TodoCard } from "@/components/todo-card";
import { useTodo } from "@/contexts/todo-context";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TodoForm } from "@/components/todo-form";
import { Todo } from "@/contexts/todo-context";

type TodoCategory = "kepemudaan" | "olahraga" | "pariwisata";

export default function TasksPage() {
  const {
    todos,
    deleteTodo,
    updateTodo,
    toggleComplete,
    getTodosByCategory,
    searchTodos,
    addTodo,
  } = useTodo();
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleDelete = (id: string) => {
    deleteTodo(id);
  };

  const handleEdit = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setEditingTodo(todo);
      setIsEditDialogOpen(true);
    }
  };

  const handleToggleComplete = (id: string) => {
    toggleComplete(id);
  };

  const handleSubmitAdd = (todo: Omit<Todo, "id" | "createdAt">) => {
    addTodo(todo);
    setIsAddDialogOpen(false);
  };

  const handleSubmitEdit = (todo: Omit<Todo, "id" | "createdAt">) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, todo);
      setIsEditDialogOpen(false);
      setEditingTodo(null);
    }
  };

  // Filter todos based on category and search query
  let filteredTodos = todos;

  if (category !== "all") {
    filteredTodos = getTodosByCategory(category as TodoCategory);
  }

  if (searchQuery) {
    filteredTodos = searchTodos(searchQuery);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tugas</h1>
          <p className="text-muted-foreground">
            Kelola semua tugas Dinas Kepemudaan, Olahraga, dan Pariwisata
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Tambah Tugas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0">
            <TodoForm
              onSubmit={handleSubmitAdd}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTodos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Tidak ada tugas ditemukan.</p>
          </div>
        ) : (
          filteredTodos.map((todo, index) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TodoCard
                todo={todo}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onToggleComplete={handleToggleComplete}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0">
          {editingTodo && (
            <TodoForm
              initialData={editingTodo}
              onSubmit={handleSubmitEdit}
              onCancel={() => setIsEditDialogOpen(false)}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
