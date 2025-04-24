"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { TodoCard } from "@/components/todo-card";
import { useTodo } from "@/contexts/todo-context";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TodoForm } from "@/components/todo-form";
import { Todo } from "@/contexts/todo-context";
import Link from "next/link";

type CategoryParams = {
  params: {
    category: "kepemudaan" | "olahraga" | "pariwisata";
  };
};

export default function CategoryPage({ params }: CategoryParams) {
  const { category } = params;
  const {
    todos,
    deleteTodo,
    updateTodo,
    toggleComplete,
    getTodosByCategory,
    searchTodos,
    addTodo,
  } = useTodo();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
    addTodo({
      ...todo,
      category: category,
    });
    setIsAddDialogOpen(false);
  };

  const handleSubmitEdit = (todo: Omit<Todo, "id" | "createdAt">) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, todo);
      setIsEditDialogOpen(false);
      setEditingTodo(null);
    }
  };

  // Get todos for the category and filter by search query if needed
  let filteredTodos = getTodosByCategory(category);

  if (searchQuery) {
    filteredTodos = searchTodos(searchQuery).filter(
      (todo) => todo.category === category
    );
  }

  // Helper function to get category title
  const getCategoryTitle = () => {
    switch (category) {
      case "kepemudaan":
        return "Kepemudaan";
      case "olahraga":
        return "Olahraga";
      case "pariwisata":
        return "Pariwisata";
      default:
        return "Kategori";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link
            href="/tasks"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali ke semua tugas
          </Link>
          <h1 className="text-3xl font-bold">Kategori: {getCategoryTitle()}</h1>
          <p className="text-muted-foreground">
            Kelola tugas berdasarkan kategori
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Tambah Tugas {getCategoryTitle()}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0">
            <TodoForm
              initialData={{ category }}
              onSubmit={handleSubmitAdd}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTodos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              Tidak ada tugas dalam kategori ini.
            </p>
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
