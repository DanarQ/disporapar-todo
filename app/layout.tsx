import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/ui/sidebar";
import { TodoProvider } from "@/contexts/todo-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DISPORAPAR Todo App",
  description:
    "Aplikasi Todo List untuk Dinas Kepemudaan, Olahraga, dan Pariwisata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <TodoProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              <div className="container max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </TodoProvider>
      </body>
    </html>
  );
}
