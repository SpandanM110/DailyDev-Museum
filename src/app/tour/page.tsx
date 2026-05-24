"use client";

import Link from "next/link";
import { useState } from "react";
import { tourExhibits } from "@/lib/collection";
import { MuseumHeader } from "@/components/MuseumHeader";

export default function TourPage() {
  const [current, setCurrent] = useState(0);
  const exhibit = tourExhibits[current];

  const tourFraming = [
    "We begin with the most acclaimed work in the collection.",
    "Next, a piece that reshaped how developers think about their tools.",
    "This exhibit demonstrates the community's hunger for practical wisdom.",
    "A work that bridges theory and daily practice.",
    "Here we see the intersection of craft and communication.",
    "The community speaks loudest when the subject is fundamentally useful.",
    "This piece earned its place through sheer utility and clarity.",
    "Notice how the best articles make complex ideas feel inevitable.",
    "A reminder that great technical writing is itself a form of engineering.",
    "We pause here to appreciate the diversity of the collection.",
    "This work represents an entire subfield of practice.",
    "Approaching the end of our tour — but not the end of the collection.",
    "A piece that rewards multiple readings.",
    "Nearly finished. This exhibit reminds us why we build.",
    "Our final stop. Thank you for walking with us.",
  ];

  return (
    <main className="min-h-screen">
      <MuseumHeader
        backLink={{ href: "/", label: "Lobby" }}
        rightLabel="Guided Tour"
      />

      {/* Progress bar */}
      <div className="w-full h-0.5 bg-parchment dark:bg-dark-border">
        <div
          className="h-full bg-ink dark:bg-cream transition-all duration-500"
          style={{ width: `${((current + 1) / tourExhibits.length) * 100}%` }}
        />
      </div>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest mb-2">
          Stop {current + 1} of {tourExhibits.length}
        </p>

        <p className="font-curator italic text-lg text-muted dark:text-dark-muted mb-8">
          {tourFraming[current]}
        </p>

        <div className="border border-parchment dark:border-dark-border p-8 bg-white dark:bg-dark-surface">
          {exhibit.image && (
            <div className="border-4 border-parchment dark:border-dark-border mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={exhibit.image}
                alt={exhibit.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <p className="font-mono text-xs text-muted dark:text-dark-muted uppercase tracking-widest mb-2">
            {exhibit.wing}
          </p>
          <h2 className="font-display text-3xl font-light mb-4">
            {exhibit.title}
          </h2>
          <p className="font-curator italic text-muted dark:text-dark-muted mb-4">
            &ldquo;{exhibit.curatorNote}&rdquo;
          </p>
          <div className="flex gap-6 font-mono text-xs text-muted dark:text-dark-muted mb-6">
            <span>{exhibit.numUpvotes.toLocaleString()} acclaim</span>
            <span>{exhibit.source.name}</span>
            {exhibit.readTime && <span>{exhibit.readTime} min read</span>}
          </div>

          <div className="flex gap-3">
            <Link
              href={`/exhibit/${exhibit.slug}`}
              className="px-4 py-2 border border-ink dark:border-cream text-ink dark:text-cream font-mono text-xs uppercase tracking-wider hover:bg-parchment dark:hover:bg-dark-bg transition-colors"
            >
              View Full Exhibit
            </Link>
            <a
              href={exhibit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-ink text-cream dark:bg-cream dark:text-ink font-mono text-xs uppercase tracking-wider hover:bg-accent dark:hover:bg-dark-accent dark:hover:text-cream transition-colors"
            >
              Read Original →
            </a>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-parchment dark:border-dark-border hover:border-ink dark:hover:border-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <p className="font-mono text-xs text-muted dark:text-dark-muted">
            {current + 1} / {tourExhibits.length}
          </p>
          {current < tourExhibits.length - 1 ? (
            <button
              onClick={() => setCurrent(current + 1)}
              className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-ink dark:border-cream hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
            >
              Next →
            </button>
          ) : (
            <Link
              href="/gift-shop"
              className="font-mono text-xs uppercase tracking-wider px-4 py-2 bg-ink text-cream dark:bg-cream dark:text-ink hover:bg-accent dark:hover:bg-dark-accent dark:hover:text-cream transition-colors"
            >
              Visit Gift Shop →
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
