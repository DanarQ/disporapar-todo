"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TodoForm } from "@/components/todo-form";
import { useTodo } from "@/contexts/todo-context";
import { Todo } from "@/lib/types";
import { Loader } from "@/components/ui/loader";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const { todos, updateTodo } = useTodo();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extract the ID from params
  const id = params?.id
    ? typeof params.id === "string"
      ? params.id
      : params.id[0]
    : "";

  useEffect(() => {
    const foundTodo = todos.find((t) => t.id === id);
    if (foundTodo) {
      setTodo(foundTodo);
    } else {
      // Todo not found, redirect to tasks page
      router.push("/tasks");
    }

    // Add small delay to ensure smooth loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id, todos, router]);

  const handleSubmit = (data: Omit<Todo, "id" | "createdAt">) => {
    if (todo) {
      updateTodo(todo.id, data);
      router.push("/tasks");
    }
  };

  const handleCancel = () => {
    router.push("/tasks");
  };

  if (isLoading || !todo) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Tugas</h1>
      <TodoForm
        initialData={todo}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing
      />
    </div>
  );
}
