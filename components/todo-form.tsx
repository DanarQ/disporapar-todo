"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Award, Compass } from "lucide-react";
import { Todo } from "@/contexts/todo-context";

type TodoCategory = "kepemudaan" | "olahraga" | "pariwisata";

interface TodoFormProps {
  initialData?: Partial<Todo>;
  onSubmit: (data: Omit<Todo, "id" | "createdAt">) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function TodoForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [completed, setCompleted] = useState(initialData?.completed || false);
  const [category, setCategory] = useState<TodoCategory>(
    (initialData?.category as TodoCategory) || "kepemudaan"
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      completed,
      category,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
  };

  const handleCategoryChange = (value: string) => {
    if (
      value === "kepemudaan" ||
      value === "olahraga" ||
      value === "pariwisata"
    ) {
      setCategory(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto rounded-2xl">
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Tugas" : "Tambah Tugas Baru"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Tugas</Label>
              <Input
                id="title"
                placeholder="Masukkan judul tugas"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <div className="relative">
                <textarea
                  id="description"
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Deskripsi tugas"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Kategori</Label>
              <Tabs
                defaultValue={category}
                onValueChange={handleCategoryChange}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 bg-muted/50">
                  <TabsTrigger
                    value="kepemudaan"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Kepemudaan</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="olahraga"
                    className="flex items-center gap-2"
                  >
                    <Award className="h-4 w-4" />
                    <span>Olahraga</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="pariwisata"
                    className="flex items-center gap-2"
                  >
                    <Compass className="h-4 w-4" />
                    <span>Pariwisata</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Tenggat Waktu (Opsional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={completed}
                onCheckedChange={(checked) => setCompleted(!!checked)}
              />
              <Label htmlFor="completed">Selesai</Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit">{isEditing ? "Simpan" : "Tambah"}</Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
