"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="font-mono text-xs text-muted hover:text-ink dark:hover:text-cream uppercase tracking-wider transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "☽ Evening Hours" : "☀ Day Visit"}
    </button>
  );
}
