import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest mb-6">
          Error 404
        </p>
        <h1 className="font-display text-5xl font-light mb-4">
          Exhibit on Loan
        </h1>
        <p className="font-curator italic text-lg text-muted dark:text-dark-muted mb-8">
          This piece has been temporarily removed for conservation.
          It may return in a future exhibition.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 border border-ink dark:border-cream text-ink dark:text-cream font-mono text-sm uppercase tracking-wider hover:bg-parchment dark:hover:bg-dark-surface transition-colors"
        >
          Return to Lobby
        </Link>
      </div>
    </main>
  );
}
