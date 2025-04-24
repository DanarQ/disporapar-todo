"use client";

import { useRouter } from "next/navigation";
import { TodoForm } from "@/components/todo-form";
import { useTodo } from "@/contexts/todo-context";
import { Todo } from "@/contexts/todo-context";

export default function NewTaskPage() {
  const router = useRouter();
  const { addTodo } = useTodo();

  const handleSubmit = (todo: Omit<Todo, "id" | "createdAt">) => {
    addTodo(todo);
    router.push("/tasks");
  };

  const handleCancel = () => {
    router.push("/tasks");
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tambah Tugas Baru</h1>
      <TodoForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
