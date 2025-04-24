"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Trash2, Edit, Users, Award, Compass, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Todo } from "@/contexts/todo-context";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TodoCardProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export function TodoCard({
  todo,
  onDelete,
  onEdit,
  onToggleComplete,
}: TodoCardProps) {
  const [checked, setChecked] = useState(todo.completed);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "kepemudaan":
        return <Users className="h-4 w-4" />;
      case "olahraga":
        return <Award className="h-4 w-4" />;
      case "pariwisata":
        return <Compass className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "kepemudaan":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "olahraga":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "pariwisata":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "";
    }
  };

  const handleCheckChange = () => {
    setChecked(!checked);
    onToggleComplete(todo.id);
  };

  // Format date for display
  const formatDueDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMMM yyyy", { locale: id });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card
        className={cn(
          "h-full transition-all duration-300 transform hover:shadow-lg rounded-2xl overflow-hidden flex flex-col",
          checked ? "bg-muted/40" : ""
        )}
      >
        <CardHeader className="p-4 pb-2 gap-2">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 font-normal",
                getCategoryColor(todo.category)
              )}
            >
              {getCategoryIcon(todo.category)}
              <span className="capitalize">{todo.category}</span>
            </Badge>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`check-${todo.id}`}
                checked={checked}
                onCheckedChange={handleCheckChange}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
            </div>
          </div>
          <CardTitle
            className={cn(
              "text-lg font-medium transition-all",
              checked ? "line-through text-muted-foreground" : ""
            )}
          >
            {todo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 flex-grow">
          <p
            className={cn(
              "text-sm text-muted-foreground mb-2",
              checked ? "line-through" : ""
            )}
          >
            {todo.description}
          </p>
          {todo.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDueDate(todo.dueDate)}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-3 border-t flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(todo.id)}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span className="text-xs">Hapus</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(todo.id)}>
            <Edit className="h-4 w-4 mr-1" />
            <span className="text-xs">Edit</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
