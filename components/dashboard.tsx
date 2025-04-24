"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Compass, CheckCircle, Clock } from "lucide-react";
import { useTodo } from "@/contexts/todo-context";
import { Loader } from "@/components/ui/loader";

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { todos, getTodosByCategory } = useTodo();

  useEffect(() => {
    if (todos.length > 0 || isLoading) {
      // Give a slight delay to show the loader
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [todos, isLoading]);

  const completedTodos = todos.filter((todo) => todo.completed);
  const pendingTodos = todos.filter((todo) => !todo.completed);

  const kepemudaanTodos = getTodosByCategory("kepemudaan");
  const olahragaTodos = getTodosByCategory("olahraga");
  const pariwisataTodos = getTodosByCategory("pariwisata");

  const statsCards = [
    {
      title: "Total Tugas",
      value: todos.length,
      icon: <Clock className="h-6 w-6 text-primary" />,
      description: "Semua tugas",
      color: "border-primary/20 bg-primary/5",
    },
    {
      title: "Tugas Selesai",
      value: completedTodos.length,
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      description: `${Math.round(
        (completedTodos.length / (todos.length || 1)) * 100
      )}% selesai`,
      color: "border-green-500/20 bg-green-500/5",
    },
    {
      title: "Kepemudaan",
      value: kepemudaanTodos.length,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      description: `${
        kepemudaanTodos.filter((t) => t.completed).length
      } selesai`,
      color: "border-blue-500/20 bg-blue-500/5",
    },
    {
      title: "Olahraga",
      value: olahragaTodos.length,
      icon: <Award className="h-6 w-6 text-yellow-600" />,
      description: `${olahragaTodos.filter((t) => t.completed).length} selesai`,
      color: "border-yellow-500/20 bg-yellow-500/5",
    },
    {
      title: "Pariwisata",
      value: pariwisataTodos.length,
      icon: <Compass className="h-6 w-6 text-purple-600" />,
      description: `${
        pariwisataTodos.filter((t) => t.completed).length
      } selesai`,
      color: "border-purple-500/20 bg-purple-500/5",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Ringkasan tugas Dinas Kepemudaan, Olahraga, dan Pariwisata
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`border rounded-2xl shadow-sm ${card.color}`}>
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Tugas Menunggu</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTodos.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Tidak ada tugas yang menunggu.
              </p>
            ) : (
              <ul className="space-y-2">
                {pendingTodos.slice(0, 5).map((todo) => (
                  <li key={todo.id} className="flex items-start border-b pb-2">
                    <div className="h-5 w-5 mr-2 rounded-full shrink-0 bg-primary/20 flex items-center justify-center mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{todo.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {todo.category}
                      </p>
                    </div>
                  </li>
                ))}
                {pendingTodos.length > 5 && (
                  <li className="text-xs text-muted-foreground text-center pt-2">
                    +{pendingTodos.length - 5} tugas lainnya
                  </li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Statistik Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Kepemudaan</span>
                  </div>
                  <span className="text-sm">
                    {kepemudaanTodos.length} tugas
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${
                        (kepemudaanTodos.filter((t) => t.completed).length /
                          (kepemudaanTodos.length || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-yellow-600" />
                    <span className="text-sm font-medium">Olahraga</span>
                  </div>
                  <span className="text-sm">{olahragaTodos.length} tugas</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-600 rounded-full"
                    style={{
                      width: `${
                        (olahragaTodos.filter((t) => t.completed).length /
                          (olahragaTodos.length || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Compass className="h-4 w-4 mr-2 text-purple-600" />
                    <span className="text-sm font-medium">Pariwisata</span>
                  </div>
                  <span className="text-sm">
                    {pariwisataTodos.length} tugas
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{
                      width: `${
                        (pariwisataTodos.filter((t) => t.completed).length /
                          (pariwisataTodos.length || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
