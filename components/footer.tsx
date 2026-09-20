"use client";

import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-6 sm:py-8 mt-12 sm:mt-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl glass-card border-0 py-5 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-white/50" />
            <span>© {new Date().getFullYear()} Grup Kompozisyon</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-white/60 hover:text-white transition-colors"
            >
              Gizlilik
            </Link>
            <Link
              href="/"
              className="text-white/60 hover:text-white transition-colors"
            >
              Kullanım
            </Link>
            <Link
              href="mailto:hello@grupkompozisyon.app"
              className="text-white/60 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
