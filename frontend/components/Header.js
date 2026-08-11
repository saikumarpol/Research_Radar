"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

export default function Header() {
  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [darkMode, setDarkMode] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /*
   * =========================================================
   * LOAD THEME
   * =========================================================
   */

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "research-radar-theme"
      );

    let shouldUseDark = false;

    if (savedTheme === "dark") {
      shouldUseDark = true;
    } else if (savedTheme === "light") {
      shouldUseDark = false;
    } else {
      /*
       * If the user has never selected a theme,
       * use the system preference.
       */

      shouldUseDark =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
    }

    setDarkMode(shouldUseDark);

    document.documentElement.classList.toggle(
      "dark",
      shouldUseDark
    );

    document.documentElement.style.colorScheme =
      shouldUseDark
        ? "dark"
        : "light";
  }, []);

  /*
   * =========================================================
   * TOGGLE THEME
   * =========================================================
   */

  function toggleTheme() {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    document.documentElement.classList.toggle(
      "dark",
      nextMode
    );

    document.documentElement.style.colorScheme =
      nextMode
        ? "dark"
        : "light";

    localStorage.setItem(
      "research-radar-theme",
      nextMode
        ? "dark"
        : "light"
    );
  }

  /*
   * =========================================================
   * CLOSE MOBILE MENU
   * =========================================================
   */

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  /*
   * =========================================================
   * HEADER
   * =========================================================
   */

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/80">

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <div className="mx-auto flex h-[68px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ===================================================
            LOGO
        =================================================== */}

        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex min-w-0 items-center gap-3"
        >

          {/* Logo Icon */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 dark:bg-white">
            <Search className="h-5 w-5 text-white dark:text-slate-950" />
          </div>

          {/* Logo Text */}

          <div className="min-w-0">

            <h1 className="truncate font-serif text-lg font-bold tracking-tight text-slate-950 dark:text-white sm:text-xl">
              Research Radar
            </h1>

            <p className="hidden text-[10px] leading-4 text-slate-400 sm:block">
              AI Research Explorer
            </p>

          </div>

        </Link>

        {/* ===================================================
            DESKTOP NAVIGATION
        =================================================== */}

        <div className="hidden items-center gap-1 md:flex">

          {/* Home */}

          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Home
          </Link>

          {/* API Docs */}

         

          {/* =================================================
              THEME BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

        </div>

        {/* ===================================================
            MOBILE CONTROLS
        =================================================== */}

        <div className="flex items-center gap-2 md:hidden">

          {/* Theme */}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Menu */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (value) => !value
              )
            }
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={
              mobileMenuOpen
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>

        </div>

      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden">

          <nav className="mx-auto flex max-w-[1500px] flex-col gap-1 px-4 py-3 sm:px-6">

            {/* Home */}

            <Link
              href="/"
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Home
            </Link>

            {/* API Docs */}

          

          </nav>

        </div>
      )}

    </header>
  );
}