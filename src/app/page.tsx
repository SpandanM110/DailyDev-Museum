import Link from "next/link";
import { wings, collection } from "@/lib/collection";
import { MuseumHeader } from "@/components/MuseumHeader";

export default function Lobby() {
  const featuredExhibit = collection.sort((a, b) => b.numUpvotes - a.numUpvotes)[0];

  return (
    <main className="min-h-screen">
      <MuseumHeader />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-[0.3em] mb-6">
          The Permanent Collection
        </p>
        <h1 className="font-display text-7xl font-light leading-tight mb-6">
          The daily.dev Museum
        </h1>
        <p className="font-curator italic text-xl text-muted dark:text-dark-muted max-w-lg mx-auto mb-12">
          One hundred of the developer community&apos;s most celebrated articles,
          curated and preserved for posterity.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/tour"
            className="px-8 py-3 bg-ink text-cream dark:bg-cream dark:text-ink font-mono text-sm uppercase tracking-wider hover:bg-muted dark:hover:bg-parchment transition-colors"
          >
            Begin Guided Tour
          </Link>
          <Link
            href="#wings"
            className="px-8 py-3 border border-ink dark:border-cream text-ink dark:text-cream font-mono text-sm uppercase tracking-wider hover:bg-parchment dark:hover:bg-dark-surface transition-colors"
          >
            Wander the Wings
          </Link>
        </div>
      </section>

      {/* Featured Exhibit */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="border border-parchment dark:border-dark-border p-8 bg-white dark:bg-dark-surface">
          <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest mb-4">
            Featured Exhibit
          </p>
          <div className="flex gap-8 items-start">
            {featuredExhibit.image && (
              <div className="w-48 h-32 flex-shrink-0 border border-parchment dark:border-dark-border overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredExhibit.image}
                  alt={featuredExhibit.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <Link
                href={`/exhibit/${featuredExhibit.slug}`}
                className="font-display text-2xl hover:text-accent dark:hover:text-dark-accent transition-colors"
              >
                {featuredExhibit.title}
              </Link>
              <p className="font-curator italic text-muted dark:text-dark-muted mt-2">
                {featuredExhibit.curatorNote}
              </p>
              <p className="font-mono text-xs text-muted dark:text-dark-muted mt-3">
                {featuredExhibit.numUpvotes.toLocaleString()} acclaim ·{" "}
                {featuredExhibit.wing}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wings */}
      <section id="wings" className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="font-display text-3xl text-center mb-2">The Wings</h2>
        <p className="font-mono text-xs text-muted dark:text-dark-muted text-center uppercase tracking-widest mb-12">
          8 galleries · 100 exhibits
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wings.map((wing) => (
            <Link
              key={wing.slug}
              href={`/wing/${wing.slug}`}
              className="group border border-parchment dark:border-dark-border p-6 hover:border-ink dark:hover:border-cream transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: wing.color }}
                />
                <div>
                  <h3 className="font-display text-xl group-hover:text-accent dark:group-hover:text-dark-accent transition-colors">
                    {wing.name}
                  </h3>
                  <p className="text-sm text-muted dark:text-dark-muted mt-1">
                    {wing.description}
                  </p>
                  <p className="font-mono text-xs text-muted dark:text-dark-muted mt-3">
                    {wing.exhibits.length} exhibits
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-parchment dark:border-dark-border py-12">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest">
              Visiting Hours
            </p>
            <p className="font-mono text-xs text-muted dark:text-dark-muted mt-1">
              Open 24/7 · Always free · No reservation needed
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest">
              Administration
            </p>
            <p className="font-mono text-xs text-muted dark:text-dark-muted mt-1">
              Curated from the daily.dev public API · Built for the 2026 Hackathon
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
