"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ListTodo,
  PlusCircle,
  Settings,
  Users,
  Award,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Menu } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const mainNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Home className="w-5 h-5" />,
  },
  {
    title: "Semua Tugas",
    href: "/tasks",
    icon: <ListTodo className="w-5 h-5" />,
  },
  {
    title: "Tambah Tugas",
    href: "/tasks/new",
    icon: <PlusCircle className="w-5 h-5" />,
  },
];

const categoryNav: NavItem[] = [
  {
    title: "Kepemudaan",
    href: "/category/kepemudaan",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Olahraga",
    href: "/category/olahraga",
    icon: <Award className="w-5 h-5" />,
  },
  {
    title: "Pariwisata",
    href: "/category/pariwisata",
    icon: <Compass className="w-5 h-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 fixed top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full bg-background">
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary">DISPORAPAR</h2>
              <p className="text-sm text-muted-foreground">Todo List App</p>
            </div>
            <div className="flex-1 px-3 py-2">
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-4">
                  MENU UTAMA
                </p>
                <nav className="space-y-1">
                  {mainNav.map((item) => (
                    <NavLink key={item.href} item={item} pathname={pathname} />
                  ))}
                </nav>
              </div>
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-4">
                  KATEGORI
                </p>
                <nav className="space-y-1">
                  {categoryNav.map((item) => (
                    <NavLink key={item.href} item={item} pathname={pathname} />
                  ))}
                </nav>
              </div>
            </div>
            <div className="p-4 border-t">
              <Link href="/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-5 h-5 mr-2" />
                  Pengaturan
                </Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:min-h-screen border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">DISPORAPAR</h2>
          <p className="text-sm text-muted-foreground">Todo List App</p>
        </div>
        <div className="flex-1 px-3 py-2">
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-4">
              MENU UTAMA
            </p>
            <nav className="space-y-1">
              {mainNav.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>
          </div>
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-4">
              KATEGORI
            </p>
            <nav className="space-y-1">
              {categoryNav.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>
          </div>
        </div>
        <div className="p-4 border-t">
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="w-5 h-5 mr-2" />
              Pengaturan
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
      )}
    >
      {item.icon}
      {item.title}
    </Link>
  );
}
