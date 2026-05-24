import Link from "next/link";
import { notFound } from "next/navigation";
import { wings, getWing } from "@/lib/collection";
import { MuseumHeader } from "@/components/MuseumHeader";

export function generateStaticParams() {
  return wings.map((w) => ({ slug: w.slug }));
}

export default function WingPage({ params }: { params: { slug: string } }) {
  const wing = getWing(params.slug);
  if (!wing) notFound();

  return (
    <main className="min-h-screen">
      <MuseumHeader backLink={{ href: "/", label: "Lobby" }} />

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: wing.color }}
          />
          <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest">
            Gallery {wings.indexOf(wing) + 1} of {wings.length}
          </p>
        </div>
        <h1 className="font-display text-5xl font-light mb-4">{wing.name}</h1>
        <p className="font-curator italic text-lg text-muted dark:text-dark-muted max-w-2xl mb-4">
          {wing.description}
        </p>
        <p className="font-mono text-xs text-muted dark:text-dark-muted">
          {wing.exhibits.length} works on display
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="space-y-1">
          {wing.exhibits.map((exhibit, i) => (
            <Link
              key={exhibit.id}
              href={`/exhibit/${exhibit.slug}`}
              className="group flex items-start gap-6 py-6 border-b border-parchment dark:border-dark-border hover:bg-parchment/30 dark:hover:bg-dark-surface/50 px-4 -mx-4 transition-colors"
            >
              <span className="font-mono text-xs text-muted dark:text-dark-muted mt-1 w-6 flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              {exhibit.image && (
                <div className="w-24 h-16 flex-shrink-0 border border-parchment dark:border-dark-border overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={exhibit.image}
                    alt=""
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg group-hover:text-accent dark:group-hover:text-dark-accent transition-colors truncate">
                  {exhibit.title}
                </h3>
                <p className="font-curator italic text-sm text-muted dark:text-dark-muted mt-1 line-clamp-1">
                  {exhibit.curatorNote}
                </p>
                <div className="flex gap-4 mt-2">
                  <span className="font-mono text-xs text-muted dark:text-dark-muted">
                    {exhibit.numUpvotes.toLocaleString()} acclaim
                  </span>
                  <span className="font-mono text-xs text-muted dark:text-dark-muted">
                    {exhibit.source.name}
                  </span>
                  {exhibit.readTime && (
                    <span className="font-mono text-xs text-muted dark:text-dark-muted">
                      {exhibit.readTime} min read
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-parchment dark:border-dark-border py-8">
        <div className="max-w-4xl mx-auto px-6 flex justify-between">
          {wings.indexOf(wing) > 0 && (
            <Link
              href={`/wing/${wings[wings.indexOf(wing) - 1].slug}`}
              className="font-mono text-xs text-muted dark:text-dark-muted hover:text-ink dark:hover:text-cream uppercase tracking-wider"
            >
              ← {wings[wings.indexOf(wing) - 1].name}
            </Link>
          )}
          <div className="flex-1" />
          {wings.indexOf(wing) < wings.length - 1 && (
            <Link
              href={`/wing/${wings[wings.indexOf(wing) + 1].slug}`}
              className="font-mono text-xs text-muted dark:text-dark-muted hover:text-ink dark:hover:text-cream uppercase tracking-wider"
            >
              {wings[wings.indexOf(wing) + 1].name} →
            </Link>
          )}
        </div>
      </footer>
    </main>
  );
}
