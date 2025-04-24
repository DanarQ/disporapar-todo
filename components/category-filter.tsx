"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Award, Compass, ListTodo } from "lucide-react";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <Tabs
      defaultValue={activeCategory}
      onValueChange={onCategoryChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 bg-muted/50">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          <span className="hidden sm:inline">Semua</span>
        </TabsTrigger>
        <TabsTrigger value="kepemudaan" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Kepemudaan</span>
        </TabsTrigger>
        <TabsTrigger value="olahraga" className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          <span className="hidden sm:inline">Olahraga</span>
        </TabsTrigger>
        <TabsTrigger value="pariwisata" className="flex items-center gap-2">
          <Compass className="h-4 w-4" />
          <span className="hidden sm:inline">Pariwisata</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
