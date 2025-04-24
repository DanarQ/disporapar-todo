"use client";

import { useRouter } from "next/navigation";
import { TodoForm } from "@/components/todo-form";
import { useTodo, Todo } from "@/contexts/todo-context";

export default function NewTaskPage() {
  const router = useRouter();
  const { addTodo } = useTodo();

  const handleSubmit = (data: Omit<Todo, "id" | "createdAt">) => {
    addTodo(data);
    router.push("/tasks");
  };

  const handleCancel = () => {
    router.push("/tasks");
  };

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="text-2xl font-bold mb-6">Tambah Tugas Baru</h1>
      <TodoForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
