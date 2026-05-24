import { collection, wings } from "@/lib/collection";
import { MuseumHeader } from "@/components/MuseumHeader";

export default function GiftShop() {
  const totalUpvotes = collection.reduce((sum, e) => sum + e.numUpvotes, 0);
  const totalComments = collection.reduce((sum, e) => sum + e.numComments, 0);

  return (
    <main className="min-h-screen">
      <MuseumHeader
        backLink={{ href: "/", label: "Lobby" }}
        rightLabel="Gift Shop"
      />

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-5xl font-light mb-4">
          The Museum Gift Shop
        </h1>
        <p className="font-curator italic text-lg text-muted dark:text-dark-muted mb-16">
          Take something home from your visit.
        </p>

        {/* Exhibition Catalogue */}
        <div className="border border-parchment dark:border-dark-border p-8 bg-white dark:bg-dark-surface mb-12">
          <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest mb-4">
            Exhibition Catalogue
          </p>
          <h2 className="font-display text-2xl mb-2">
            The Permanent Collection — Complete Catalogue
          </h2>
          <p className="text-sm text-muted dark:text-dark-muted mb-2">
            All 100 exhibits with curator&apos;s notes, organized by wing.
            Typeset for reading at your leisure.
          </p>
          <p className="font-mono text-xs text-muted dark:text-dark-muted mb-6">
            Dynamically generated — always reflects the current collection.
          </p>
          <a
            href="/api/catalogue"
            className="inline-block px-6 py-3 bg-ink text-cream dark:bg-cream dark:text-ink font-mono text-sm uppercase tracking-wider hover:bg-accent dark:hover:bg-dark-accent dark:hover:text-cream transition-colors"
          >
            Download Catalogue (PDF)
          </a>
        </div>

        {/* Collection Statistics */}
        <div className="border border-parchment dark:border-dark-border p-8 bg-white dark:bg-dark-surface mb-12">
          <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest mb-6">
            Collection Statistics
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="font-display text-3xl">{collection.length}</p>
              <p className="font-mono text-xs text-muted dark:text-dark-muted mt-1">
                Exhibits
              </p>
            </div>
            <div>
              <p className="font-display text-3xl">{wings.length}</p>
              <p className="font-mono text-xs text-muted dark:text-dark-muted mt-1">
                Wings
              </p>
            </div>
            <div>
              <p className="font-display text-3xl">
                {totalUpvotes.toLocaleString()}
              </p>
              <p className="font-mono text-xs text-muted dark:text-dark-muted mt-1">
                Total Acclaim
              </p>
            </div>
            <div>
              <p className="font-display text-3xl">
                {totalComments.toLocaleString()}
              </p>
              <p className="font-mono text-xs text-muted dark:text-dark-muted mt-1">
                Discussions
              </p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="border border-parchment dark:border-dark-border p-8 bg-white dark:bg-dark-surface">
          <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest mb-4">
            About the Museum
          </p>
          <div className="space-y-4 text-sm text-muted dark:text-dark-muted leading-relaxed">
            <p>
              The daily.dev Museum is a hackathon project built for the daily.dev
              Hackathon (May 2026). It presents 100 of the most celebrated
              developer articles as museum exhibits — complete with wings,
              plaques, curator&apos;s notes, and a guided tour.
            </p>
            <p>
              All articles were sourced from the daily.dev Public API, ranked by
              community acclaim (upvotes), and curated into eight thematic wings
              covering the full breadth of software development.
            </p>
            <p>
              The museum metaphor is deliberate: these articles deserve more than
              a bookmark. They deserve to be exhibited.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-parchment dark:border-dark-border">
            <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest mb-3">
              Credits
            </p>
            <ul className="space-y-1 font-mono text-xs text-muted dark:text-dark-muted">
              <li>Data: daily.dev Public API</li>
              <li>Built with: Next.js, Tailwind CSS, TypeScript</li>
              <li>Typography: Cormorant Garamond, Inter, JetBrains Mono</li>
              <li>Curator: Spandan with Claude (Anthropic)</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
