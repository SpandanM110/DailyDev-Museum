import Link from "next/link";
import { notFound } from "next/navigation";
import { collection, getExhibit, getRelatedExhibits, getWing } from "@/lib/collection";
import { MuseumHeader } from "@/components/MuseumHeader";

export function generateStaticParams() {
  return collection.map((e) => ({ slug: e.slug }));
}

export default function ExhibitPage({ params }: { params: { slug: string } }) {
  const exhibit = getExhibit(params.slug);
  if (!exhibit) notFound();

  const related = getRelatedExhibits(exhibit);
  const wing = getWing(exhibit.wingSlug);
  const publishDate = exhibit.publishedAt
    ? new Date(exhibit.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen">
      <MuseumHeader
        backLink={{ href: `/wing/${exhibit.wingSlug}`, label: exhibit.wing }}
      />

      <article className="max-w-3xl mx-auto px-6 py-16">
        {exhibit.image && (
          <div className="mb-10">
            <div className="border-8 border-parchment dark:border-dark-border shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={exhibit.image}
                alt={exhibit.title}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        <div className="border border-parchment dark:border-dark-border bg-white dark:bg-dark-surface p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            {wing && (
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: wing.color }}
              />
            )}
            <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest">
              {exhibit.wing}
            </p>
          </div>

          <h1 className="font-display text-4xl font-light leading-snug mb-4">
            {exhibit.title}
          </h1>

          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted dark:text-dark-muted mb-6">
            <span>Source: {exhibit.source.name}</span>
            {publishDate && <span>Published: {publishDate}</span>}
            {exhibit.readTime && <span>{exhibit.readTime} min read</span>}
          </div>

          <div className="flex gap-8 pb-6 border-b border-parchment dark:border-dark-border mb-6">
            <div>
              <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-wider">
                Acclaim
              </p>
              <p className="font-display text-2xl">
                {exhibit.numUpvotes.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-wider">
                Discussion
              </p>
              <p className="font-display text-2xl">
                {exhibit.numComments.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest mb-2">
              Curator&apos;s Note
            </p>
            <p className="font-curator italic text-lg text-muted dark:text-dark-muted leading-relaxed">
              &ldquo;{exhibit.curatorNote}&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {exhibit.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs px-2 py-1 bg-parchment dark:bg-dark-bg text-muted dark:text-dark-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href={exhibit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-ink text-cream dark:bg-cream dark:text-ink font-mono text-sm uppercase tracking-wider hover:bg-accent dark:hover:bg-dark-accent dark:hover:text-cream transition-colors"
          >
            View the Original Work →
          </a>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest mb-6">
              Adjacent in the Collection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/exhibit/${r.slug}`}
                  className="group border border-parchment dark:border-dark-border p-4 hover:border-ink dark:hover:border-cream transition-colors"
                >
                  {r.image && (
                    <div className="w-full h-20 mb-3 overflow-hidden border border-parchment dark:border-dark-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.image}
                        alt=""
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  )}
                  <h3 className="font-display text-sm group-hover:text-accent dark:group-hover:text-dark-accent transition-colors line-clamp-2">
                    {r.title}
                  </h3>
                  <p className="font-mono text-xs text-muted dark:text-dark-muted mt-2">
                    {r.numUpvotes.toLocaleString()} acclaim
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
