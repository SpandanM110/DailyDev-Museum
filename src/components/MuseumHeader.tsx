import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

interface MuseumHeaderProps {
  backLink?: { href: string; label: string };
  rightLabel?: string;
}

export function MuseumHeader({ backLink, rightLabel }: MuseumHeaderProps) {
  return (
    <header className="border-b border-parchment dark:border-dark-border">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backLink ? (
            <Link
              href={backLink.href}
              className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest hover:text-ink dark:hover:text-cream transition-colors"
            >
              ← {backLink.label}
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/daily-dev-logo.gif"
                alt="daily.dev"
                className="h-8 w-auto"
              />
              <span className="font-display text-lg group-hover:text-accent dark:group-hover:text-dark-accent transition-colors">
                The Museum
              </span>
            </Link>
          )}
        </div>
        <nav className="flex gap-5 items-center">
          <ThemeToggle />
          <Link
            href="/tour"
            className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-wider hover:text-ink dark:hover:text-cream transition-colors hidden sm:inline"
          >
            Tour
          </Link>
          <Link
            href="/gift-shop"
            className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-wider hover:text-ink dark:hover:text-cream transition-colors hidden sm:inline"
          >
            Gift Shop
          </Link>
          {rightLabel && (
            <span className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest">
              {rightLabel}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
