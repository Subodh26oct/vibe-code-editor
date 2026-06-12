"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import UserButton from "../auth/components/user-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div
          className={`
            relative flex items-center justify-between
            bg-white/70 dark:bg-zinc-950/70
            backdrop-blur-md
            border border-zinc-200/80 dark:border-zinc-800/80
            shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)]
            rounded-2xl
            px-4 sm:px-6 py-2.5
            transition-all duration-300 ease-in-out
          `}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-transform duration-300"
            >
              <div className="relative transform group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  height={40}
                  width={40}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="hidden sm:block font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 group-hover:from-rose-600 group-hover:to-pink-600 dark:group-hover:from-rose-400 dark:group-hover:to-pink-400 transition-all duration-300">
                VibeCode Editor
              </span>
            </Link>
            
            <span className="hidden md:block text-zinc-300 dark:text-zinc-800">|</span>
            
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/docs/components/background-paths"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-150 transition-colors duration-200 relative group"
              >
                Docs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 group-hover:w-full transition-all duration-300" />
              </Link>
              
              <Link
                href="https://codesnippetui.pro/templates?utm_source=codesnippetui.com&utm_medium=header"
                target="_blank"
                className="text-sm font-medium text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-150 transition-colors duration-200 flex items-center gap-1.5 relative group"
              >
                API
                <span className="text-[10px] text-green-600 dark:text-green-400 border border-green-500/30 dark:border-green-400/30 bg-green-500/10 dark:bg-green-400/10 rounded-md px-1.5 py-0.5 font-semibold leading-none shadow-[0_0_8px_rgba(34,197,94,0.15)]">
                  New
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </nav>
          </div>

          {/* Right Side Actions (Theme, User, Mobile Burger) */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <ThemeToggle />
              <span className="text-zinc-300 dark:text-zinc-800">|</span>
              <UserButton />
            </div>

            {/* Mobile Only Quick Actions (If menu closed, show toggles; else show burger) */}
            <div className="flex sm:hidden items-center gap-3">
              <ThemeToggle />
              <UserButton />
            </div>

            {/* Burger Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 animate-in spin-in-90 duration-200" /> : <Menu className="w-5 h-5 animate-in fade-in duration-200" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mt-2 md:hidden overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg shadow-xl transition-all duration-300 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col p-4 gap-3">
              <Link
                href="/docs/components/action-search-bar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                Docs
              </Link>
              <Link
                href="https://codesnippetui.pro/templates?utm_source=codesnippetui.com&utm_medium=header"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <span>API</span>
                <span className="text-[10px] text-green-600 dark:text-green-400 border border-green-500/30 dark:border-green-400/30 bg-green-500/10 dark:bg-green-400/10 rounded-md px-1.5 py-0.5 font-semibold">
                  New
                </span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
