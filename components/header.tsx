"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 safe-top safe-x">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-3">
        <div className="glass-card border-0 shadow-2xl rounded-2xl flex items-center justify-between h-14 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <Sparkles className="h-5 w-5" />
            <span>Grup Kompozisyon</span>
          </Link>
          <nav className="flex items-center gap-3">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
