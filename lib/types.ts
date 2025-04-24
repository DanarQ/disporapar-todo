// Types that can be shared between client and server
export type TodoCategory = "kepemudaan" | "olahraga" | "pariwisata";

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: TodoCategory;
  createdAt: string;
  dueDate?: string;
}
