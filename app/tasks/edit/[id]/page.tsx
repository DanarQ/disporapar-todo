"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TodoForm } from "@/components/todo-form";
import { useTodo, Todo } from "@/contexts/todo-context";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const { todos, updateTodo } = useTodo();
  const [todo, setTodo] = useState<Todo | null>(null);

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

  if (!todo) {
    return (
      <div className="container flex items-center justify-center py-10">
        <div className="text-center">
          <p>Loading...</p>
        </div>
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
