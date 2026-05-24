import collectionData from "../../data/collection.json";

export interface Exhibit {
  id: string;
  slug: string;
  title: string;
  url: string;
  image: string | null;
  summary: string | null;
  publishedAt: string | null;
  source: { id: string; name: string; handle: string; image: string };
  tags: string[];
  readTime: number | null;
  numUpvotes: number;
  numComments: number;
  author: { name: string; image: string } | null;
  commentsPermalink: string;
  wing: string;
  wingSlug: string;
  curatorNote: string;
}

export interface Wing {
  slug: string;
  name: string;
  description: string;
  color: string;
  exhibits: Exhibit[];
}

const WING_META: Record<string, { description: string; color: string }> = {
  "the-frontend-wing": {
    description: "Works exploring the visible layer — where design meets interaction and pixels become interfaces.",
    color: "#4F46E5",
  },
  "the-backend-hall": {
    description: "The machinery behind the curtain. APIs, databases, and the invisible architecture that holds everything together.",
    color: "#059669",
  },
  "the-ai-ml-pavilion": {
    description: "Artifacts from the intelligence frontier. Neural networks, language models, and the algorithms learning to think.",
    color: "#7C3AED",
  },
  "the-devops-annex": {
    description: "The infrastructure of delivery. Containers, pipelines, and the discipline of shipping reliably.",
    color: "#D97706",
  },
  "the-languages-gallery": {
    description: "A celebration of syntax and semantics. Each language a different lens on the same computational universe.",
    color: "#DC2626",
  },
  "the-career-craft-room": {
    description: "The human dimension of software. Career navigation, professional growth, and the craft beyond code.",
    color: "#0891B2",
  },
  "the-tools-workshop": {
    description: "The implements of creation. Editors, version control, and the utilities that multiply a developer's reach.",
    color: "#65A30D",
  },
  "the-theory-library": {
    description: "Foundational knowledge. Algorithms, patterns, and architectural principles that transcend any single technology.",
    color: "#BE185D",
  },
};

export const collection: Exhibit[] = collectionData as Exhibit[];

export const wings: Wing[] = Object.entries(WING_META).map(([slug, meta]) => ({
  slug,
  name: meta.description ? collection.find((e) => e.wingSlug === slug)?.wing || slug : slug,
  ...meta,
  exhibits: collection.filter((e) => e.wingSlug === slug).sort((a, b) => b.numUpvotes - a.numUpvotes),
}));

// Fix wing names from the data
wings.forEach((w) => {
  const firstExhibit = collection.find((e) => e.wingSlug === w.slug);
  if (firstExhibit) w.name = firstExhibit.wing;
});

export function getExhibit(slug: string): Exhibit | undefined {
  return collection.find((e) => e.slug === slug);
}

export function getWing(slug: string): Wing | undefined {
  return wings.find((w) => w.slug === slug);
}

export function getRelatedExhibits(exhibit: Exhibit, count = 3): Exhibit[] {
  return collection
    .filter((e) => e.id !== exhibit.id)
    .map((e) => ({
      exhibit: e,
      score:
        (e.wingSlug === exhibit.wingSlug ? 2 : 0) +
        e.tags.filter((t) => exhibit.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((e) => e.exhibit);
}

export const tourExhibits: Exhibit[] = collection
  .sort((a, b) => b.numUpvotes - a.numUpvotes)
  .slice(0, 15);
