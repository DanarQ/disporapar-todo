"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TodoForm } from "@/components/todo-form";
import { useTodo } from "@/contexts/todo-context";
import { Todo } from "@/lib/types";
import { Loader } from "@/components/ui/loader";

export default function NewTaskPage() {
  const router = useRouter();
  const { addTodo } = useTodo();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (data: Omit<Todo, "id" | "createdAt">) => {
    addTodo(data);
    router.push("/tasks");
  };

  const handleCancel = () => {
    router.push("/tasks");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="text-2xl font-bold mb-6">Tambah Tugas Baru</h1>
      <TodoForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
