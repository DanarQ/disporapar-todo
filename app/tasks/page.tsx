"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TodoCard } from "@/components/todo-card";
import { useTodo } from "@/contexts/todo-context";
import { Todo } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";

export default function TasksPage() {
  const router = useRouter();
  const { todos = [], deleteTodo, toggleComplete } = useTodo();
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Memoized filter function for better performance
  const filterTodos = useCallback(() => {
    // Start with all todos, ensuring it's an array
    let result = Array.isArray(todos) ? [...todos] : [];

    // Apply category filter
    if (filterCategory !== "all") {
      result = result.filter((todo) => todo.category === filterCategory);
    }

    // Apply status filter
    if (filterStatus === "completed") {
      result = result.filter((todo) => todo.completed);
    } else if (filterStatus === "active") {
      result = result.filter((todo) => !todo.completed);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          todo.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [todos, filterCategory, filterStatus, searchQuery]);

  // Update filtered todos when dependencies change
  useEffect(() => {
    setFilteredTodos(filterTodos());
  }, [filterTodos]);

  // Set loading to false after data is loaded
  useEffect(() => {
    if (Array.isArray(todos) && (todos.length > 0 || isLoading)) {
      setIsLoading(false);
    }
  }, [todos, isLoading]);

  // Memoized handlers
  const handleNewTask = useCallback(() => {
    router.push("/tasks/new");
  }, [router]);

  const handleEditTask = useCallback(
    (id: string) => {
      router.push(`/tasks/edit/${id}`);
    },
    [router]
  );

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  // Only recompute this if filteredTodos changes
  const todoElements = useMemo(() => {
    return filteredTodos.map((todo) => (
      <motion.div
        key={todo.id}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <TodoCard
          todo={todo}
          onEdit={handleEditTask}
          onDelete={deleteTodo}
          onToggleComplete={toggleComplete}
        />
      </motion.div>
    ));
  }, [filteredTodos, handleEditTask, deleteTodo, toggleComplete]);

  // Empty state memo
  const emptyState = useMemo(
    () => (
      <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
        <Filter className="mb-2 h-12 w-12" />
        <h3 className="mb-1 text-xl font-semibold">Tidak ada tugas</h3>
        <p>
          {searchQuery
            ? "Tidak ada tugas yang cocok dengan kriteria pencarian."
            : "Belum ada tugas. Klik tombol 'Tambah Tugas' untuk membuat tugas baru."}
        </p>
      </div>
    ),
    [searchQuery]
  );

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Tugas</h1>
        <Button onClick={handleNewTask} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Tambah Tugas</span>
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari tugas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </form>
          </div>
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="kepemudaan">Kepemudaan</SelectItem>
                <SelectItem value="olahraga">Olahraga</SelectItem>
                <SelectItem value="pariwisata">Pariwisata</SelectItem>
              </SelectContent>
            </Select>

            <Tabs
              value={filterStatus}
              onValueChange={setFilterStatus}
              className="w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="active">Aktif</TabsTrigger>
                <TabsTrigger value="completed">Selesai</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-300px)]">
          <Loader className="h-8 w-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTodos.length > 0 ? todoElements : emptyState}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
