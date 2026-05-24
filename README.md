# The daily.dev Museum

A museum-themed gallery showcasing **100 curated articles** from the daily.dev community's all-time best — with wings, plaques, curator's notes, a guided tour, and a downloadable exhibition catalogue.

Built for the [daily.dev Hackathon](https://daily.dev) (May 2026).

---

## The Concept

Developer articles deserve more than a bookmark. They deserve to be **exhibited**.

The daily.dev Museum treats the community's most celebrated posts as works of art — organized into eight thematic wings, each piece accompanied by a plaque (source, date, acclaim count) and a curator's note written in the voice of a museum placard writer who happens to love code.

---

## Features

**The Lobby** — Curator's welcome, featured exhibit, and entry points to all eight wings.

**8 Wings** — Thematic galleries covering the breadth of software development:
- The Frontend Wing
- The Backend Hall
- The AI/ML Pavilion
- The DevOps Annex
- The Languages Gallery
- The Career & Craft Room
- The Tools Workshop
- The Theory Library

**100 Exhibit Pages** — Each article displayed as a framed painting with:
- OG image as the "artwork"
- Museum plaque (title, source, publish date, acclaim)
- Curator's note (1-2 sentences, museum voice)
- "View the Original Work" link
- 3 related exhibits ("Adjacent in the Collection")

**Guided Tour** — A sequential walk through 15 highlight exhibits with a progress bar, prev/next navigation, and curator framing at each stop.

**Gift Shop** — Collection statistics, about section, credits, and a dynamically generated **PDF exhibition catalogue** (all 100 pieces, typeset with cover, table of contents, and colophon).

**Light/Dark Theme** — "Day Visit" (cream/parchment museum aesthetic) and "Evening Hours" (rich dark gallery) with system preference detection.

**Custom 404** — "This exhibit is on loan."

---

## Tech Stack

- **Next.js 14** (App Router, static generation)
- **TypeScript**
- **Tailwind CSS** (custom museum palette)
- **@react-pdf/renderer** (PDF catalogue generation)
- **daily.dev Public API** (data source)

---

## Architecture

```
/                          Lobby
/wing/[slug]               Wing index pages (8)
/exhibit/[slug]            Exhibit deep-link pages (100)
/tour                      Guided tour (15 highlights)
/gift-shop                 Gift shop + PDF download
/api/catalogue             Dynamic PDF catalogue endpoint
```

All 114 pages are **statically generated at build time**. The collection is snapshotted to `data/collection.json` — no live API calls in production.

---

## Data Pipeline

1. **Fetch** — `scripts/fetch-collection.ts` pulls ~2,500 posts from the daily.dev Public API using search, popular feed, tag feeds, and keyword recommendations.
2. **Curate** — `scripts/curate-collection.ts` deduplicates, assigns posts to wings based on tags, picks the top ~12-13 per wing by upvote count, and generates curator's notes.
3. **Snapshot** — The final 100 exhibits are saved to `data/collection.json`, which becomes the source of truth for the site.

---

## Getting Started

```bash
# Install dependencies
npm install

# Add your daily.dev PAT (never committed)
echo "DAILY_PAT=your_token_here" > .env.local

# (Optional) Re-fetch and re-curate the collection
npm run fetch
npx tsx scripts/curate-collection.ts

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Deploy

Deploy to Vercel:

```bash
npm i -g vercel
vercel
```

No environment variables needed in production — the collection is baked into the build.

---

## Credits

- **Data**: [daily.dev Public API](https://docs.daily.dev)
- **Built with**: Next.js, Tailwind CSS, TypeScript
- **Typography**: Cormorant Garamond, Inter, JetBrains Mono
- **Curator**: Spandan with Claude (Anthropic)

---

## License

MIT
