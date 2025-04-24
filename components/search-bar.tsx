"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative flex w-full max-w-sm items-center"
    >
      <Input
        type="text"
        placeholder="Cari tugas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-10 rounded-xl border-input focus-visible:ring-primary"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute right-0 h-full px-3 text-muted-foreground hover:text-foreground"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Cari</span>
      </Button>
    </form>
  );
}
