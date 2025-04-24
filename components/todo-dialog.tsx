"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TodoForm } from "@/components/todo-form";
import { Todo, TodoCategory } from "@/lib/types";

interface TodoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  todo?: Todo;
  onSubmit: (data: Omit<Todo, "id" | "createdAt">) => void;
  onCancel: () => void;
  isEditing?: boolean;
  categoryOverride?: TodoCategory;
  title?: string;
}

export function TodoDialog({
  isOpen,
  onOpenChange,
  todo,
  onSubmit,
  onCancel,
  isEditing = false,
  categoryOverride,
  title = isEditing ? "Edit Task" : "Add Task",
}: TodoDialogProps) {
  // Create initial data from todo or category override
  const initialData =
    todo || (categoryOverride ? { category: categoryOverride } : undefined);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <TodoForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isEditing={isEditing}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
