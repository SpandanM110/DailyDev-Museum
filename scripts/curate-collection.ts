import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface Candidate {
  id: string;
  title: string;
  url: string;
  image: string | null;
  summary: string | null;
  publishedAt: string | null;
  createdAt: string;
  source: { id: string; name: string; handle: string; image: string };
  tags: string[];
  readTime: number | null;
  numUpvotes: number;
  numComments: number;
  author: { name: string; image: string } | null;
  commentsPermalink: string;
}

interface Exhibit {
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

const WINGS = {
  "the-frontend-wing": {
    name: "The Frontend Wing",
    tags: ["react", "react-hooks", "vue", "angular", "svelte", "css", "html", "tailwindcss", "webdev", "frontend", "ui", "ux", "web-components", "next", "nextjs", "sass", "responsive-design"],
  },
  "the-backend-hall": {
    name: "The Backend Hall",
    tags: ["api", "rest", "graphql", "microservices", "backend", "node", "nodejs", "express", "django", "spring", "database", "sql", "nosql", "mongodb", "postgresql", "redis", "server"],
  },
  "the-ai-ml-pavilion": {
    name: "The AI/ML Pavilion",
    tags: ["ai", "machine-learning", "deep-learning", "neural-network", "chatgpt", "llm", "gpt", "openai", "nlp", "data-science", "tensorflow", "pytorch", "generative-ai", "prompt-engineering"],
  },
  "the-devops-annex": {
    name: "The DevOps Annex",
    tags: ["docker", "kubernetes", "devops", "ci-cd", "aws", "cloud", "terraform", "ansible", "jenkins", "github-actions", "monitoring", "observability", "infrastructure", "linux", "nginx", "deployment"],
  },
  "the-languages-gallery": {
    name: "The Languages Gallery",
    tags: ["rust", "golang", "go", "python", "java", "kotlin", "swift", "c", "cpp", "csharp", "ruby", "elixir", "haskell", "zig", "programming-languages"],
  },
  "the-career-craft-room": {
    name: "The Career & Craft Room",
    tags: ["career", "interview-questions", "job", "resume", "productivity", "soft-skills", "mentoring", "tech-industry", "freelancing", "remote-work", "developer-experience", "burnout", "salary"],
  },
  "the-tools-workshop": {
    name: "The Tools Workshop",
    tags: ["git", "vscode", "vim", "neovim", "terminal", "cli", "developer-tools", "ide", "debugging", "testing", "automation", "open-source", "npm", "webpack", "bun"],
  },
  "the-theory-library": {
    name: "The Theory Library",
    tags: ["algorithms", "data-structures", "design-patterns", "architecture", "system-design", "distributed-systems", "clean-code", "solid", "ddd", "performance", "security", "cryptography", "networking"],
  },
};

function assignWing(post: Candidate): string | null {
  let bestWing: string | null = null;
  let bestScore = 0;

  for (const [slug, wing] of Object.entries(WINGS)) {
    let score = 0;
    for (const tag of post.tags) {
      if (wing.tags.includes(tag.toLowerCase())) score++;
    }
    // Also check title keywords
    const titleLower = post.title.toLowerCase();
    for (const tag of wing.tags) {
      if (titleLower.includes(tag.replace("-", " "))) score += 0.5;
    }
    if (score > bestScore) {
      bestScore = score;
      bestWing = slug;
    }
  }
  return bestWing;
}

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
    .replace(/-$/, "");
}

function generateCuratorNote(post: Candidate): string {
  const t = post.title.toLowerCase();
  const tags = post.tags.join(" ").toLowerCase();
  const upvotes = post.numUpvotes;

  // Context-aware curator notes based on content signals
  if (upvotes > 2000) return "A piece that commanded the attention of thousands — the kind of article developers bookmark before they finish reading.";
  if (t.includes("algorithm") || t.includes("data structure")) return "The perennial challenge of computational thinking, distilled into something approachable. A rite of passage, preserved here.";
  if (t.includes("react") && t.includes("practice")) return "React's ecosystem rewards discipline. This piece maps the terrain between 'it works' and 'it works well.'";
  if (t.includes("design pattern")) return "Patterns are the shared vocabulary of software craft. This exhibit reminds us that most problems have been solved before.";
  if (t.includes("tailwind")) return "Utility-first CSS, once controversial, now canonical. This piece captures the moment the community chose pragmatism.";
  if (t.includes("security")) return "A quiet warning in exhibit form. The vulnerabilities it names remain open in production systems today.";
  if (t.includes("docker") || t.includes("kubernetes")) return "Containerization transformed deployment from ritual to routine. Here is the map that guided many through that transition.";
  if (t.includes("system design") || t.includes("interview")) return "The whiteboard interview persists. This artifact shows how practitioners prepare for its peculiar demands.";
  if (t.includes("api")) return "APIs are the seams between systems. This piece examines what makes those seams hold under pressure.";
  if (t.includes("git")) return "Version control is infrastructure so fundamental we forget it was invented. This work honors the craft within the tool.";
  if (t.includes("rust")) return "Rust asks more of its practitioners and rewards them with certainty. This piece documents that bargain.";
  if (t.includes("golang") || t.includes("go ")) return "Go's deliberate simplicity is itself a design statement. Exhibited here as evidence of that philosophy in practice.";
  if (t.includes("python")) return "Python's accessibility made it the lingua franca of a generation. This piece speaks in that shared tongue.";
  if (t.includes("typescript") || t.includes("type")) return "Types as documentation, types as guardrails. This exhibit explores the space between freedom and safety.";
  if (t.includes("javascript")) return "JavaScript's evolution from scripting curiosity to platform substrate remains one of computing's great surprises.";
  if (t.includes("css")) return "Styling the web remains an act of negotiation — between browsers, breakpoints, and taste. A fine specimen.";
  if (t.includes("ai") || t.includes("chatgpt") || t.includes("llm") || t.includes("gpt")) return "Acquired during the great AI acceleration. Future visitors will study this period with particular interest.";
  if (t.includes("career") || t.includes("engineer")) return "The craft extends beyond code into the human systems that produce it. A document of professional wisdom.";
  if (t.includes("productivity") || t.includes("workflow")) return "Efficiency as an art form. This piece examines how practitioners optimize the act of creation itself.";
  if (t.includes("database") || t.includes("sql")) return "Data outlives the applications that create it. This work respects that permanence.";
  if (t.includes("cloud") || t.includes("aws")) return "The cloud abstracted away the datacenter. This exhibit preserves the knowledge of what runs beneath.";
  if (t.includes("linux") || t.includes("command line") || t.includes("terminal")) return "The terminal endures because text never goes out of fashion. A tribute to the command line's quiet power.";
  if (t.includes("testing") || t.includes("test")) return "Tests are the conscience of a codebase — silent until something breaks. This piece makes their value audible.";
  if (t.includes("open source") || t.includes("open-source")) return "Open source is both gift economy and infrastructure. This exhibit sits at that intersection.";
  if (t.includes("performance") || t.includes("optimization")) return "Milliseconds matter. This piece demonstrates that performance is a feature, never an afterthought.";
  if (t.includes("microservice")) return "The microservice era promised independence and delivered complexity. This work navigates both.";
  if (t.includes("architecture") || t.includes("clean")) return "Architecture is the art of decisions that are expensive to reverse. Exhibited here as a guide to making them well.";
  if (t.includes("beginner") || t.includes("learn") || t.includes("start")) return "Every expert was once a beginner. This piece honors the courage of starting.";
  if (t.includes("deploy") || t.includes("ci") || t.includes("pipeline")) return "The distance between 'it works on my machine' and 'it works' is measured in pipeline stages. Documented here.";
  if (t.includes("debug")) return "Debugging is detective work. This exhibit preserves the methods of investigation.";
  if (t.includes("vscode") || t.includes("editor") || t.includes("ide")) return "A developer's editor is their workshop. This piece curates the tools within the tool.";
  if (tags.includes("webdev")) return "The web remains the most democratic platform ever built. This work contributes to its ongoing construction.";
  if (tags.includes("devops")) return "DevOps dissolved the wall between building and running. This artifact comes from that dissolution.";
  if (tags.includes("career")) return "Software engineering is a career built in public. This piece offers navigational wisdom.";

  // Fallback based on engagement
  if (upvotes > 500) return "A work that earned its place through sustained community acclaim. The upvote count speaks to resonance.";
  if (upvotes > 200) return "Selected for the permanent collection on the basis of craft, clarity, and community recognition.";
  return "A worthy addition to the permanent collection, chosen for its contribution to the developer canon.";
}

function main() {
  const raw = readFileSync(join(__dirname, "..", "data", "candidates.json"), "utf-8");
  const candidates: Candidate[] = JSON.parse(raw);

  console.log(`📋 Starting curation of ${candidates.length} candidates...\n`);

  // Assign wings
  const wingBuckets: Record<string, Candidate[]> = {};
  for (const slug of Object.keys(WINGS)) wingBuckets[slug] = [];

  const unassigned: Candidate[] = [];

  for (const post of candidates) {
    const wing = assignWing(post);
    if (wing) {
      wingBuckets[wing].push(post);
    } else {
      unassigned.push(post);
    }
  }

  // Report distribution
  console.log("Wing distribution (before balancing):");
  for (const [slug, posts] of Object.entries(wingBuckets)) {
    console.log(`  ${WINGS[slug as keyof typeof WINGS].name}: ${posts.length} candidates`);
  }
  console.log(`  Unassigned: ${unassigned.length}\n`);

  // Pick top posts per wing, aiming for 12-13 each (total 100)
  const TARGET_TOTAL = 100;
  const wingCount = Object.keys(WINGS).length; // 8
  const basePerWing = Math.floor(TARGET_TOTAL / wingCount); // 12
  let remaining = TARGET_TOTAL - basePerWing * wingCount; // 4 extra to distribute

  const collection: Exhibit[] = [];
  const usedSlugs = new Set<string>();

  for (const [wingSlug, posts] of Object.entries(wingBuckets)) {
    const quota = basePerWing + (remaining > 0 ? 1 : 0);
    if (remaining > 0) remaining--;

    // Sort by upvotes, take top N
    const sorted = posts.sort((a, b) => b.numUpvotes - a.numUpvotes);
    const selected = sorted.slice(0, quota);

    for (const post of selected) {
      let slug = makeSlug(post.title);
      if (usedSlugs.has(slug)) slug = `${slug}-${post.id.slice(0, 5)}`;
      usedSlugs.add(slug);

      collection.push({
        id: post.id,
        slug,
        title: post.title,
        url: post.url,
        image: post.image,
        summary: post.summary,
        publishedAt: post.publishedAt,
        source: post.source,
        tags: post.tags,
        readTime: post.readTime,
        numUpvotes: post.numUpvotes,
        numComments: post.numComments,
        author: post.author,
        commentsPermalink: post.commentsPermalink,
        wing: WINGS[wingSlug as keyof typeof WINGS].name,
        wingSlug,
        curatorNote: generateCuratorNote(post),
      });
    }
  }

  // If we're short (wings didn't have enough), fill from remaining candidates
  if (collection.length < TARGET_TOTAL) {
    const usedIds = new Set(collection.map((e) => e.id));
    const allRemaining = candidates.filter((c) => !usedIds.has(c.id)).sort((a, b) => b.numUpvotes - a.numUpvotes);
    const needed = TARGET_TOTAL - collection.length;
    const extra = allRemaining.slice(0, needed);
    for (const post of extra) {
      let slug = makeSlug(post.title);
      if (usedSlugs.has(slug)) slug = `${slug}-${post.id.slice(0, 5)}`;
      usedSlugs.add(slug);
      const smallest = Object.entries(wingBuckets)
        .map(([s]) => [s, collection.filter((e) => e.wingSlug === s).length] as [string, number])
        .sort((a, b) => a[1] - b[1])[0][0];

      collection.push({
        id: post.id,
        slug,
        title: post.title,
        url: post.url,
        image: post.image,
        summary: post.summary,
        publishedAt: post.publishedAt,
        source: post.source,
        tags: post.tags,
        readTime: post.readTime,
        numUpvotes: post.numUpvotes,
        numComments: post.numComments,
        author: post.author,
        commentsPermalink: post.commentsPermalink,
        wing: WINGS[smallest as keyof typeof WINGS].name,
        wingSlug: smallest,
        curatorNote: generateCuratorNote(post),
      });
    }
  }

  // Original fallback (keep for safety)
  if (false && collection.length < TARGET_TOTAL && unassigned.length > 0) {
    const needed = TARGET_TOTAL - collection.length;
    const extra = unassigned.sort((a, b) => b.numUpvotes - a.numUpvotes).slice(0, needed);
    for (const post of extra) {
      let slug = makeSlug(post.title);
      if (usedSlugs.has(slug)) slug = `${slug}-${post.id.slice(0, 5)}`;
      usedSlugs.add(slug);
      // Assign to smallest wing
      const smallest = Object.entries(wingBuckets)
        .map(([s]) => [s, collection.filter((e) => e.wingSlug === s).length] as [string, number])
        .sort((a, b) => a[1] - b[1])[0][0];

      collection.push({
        id: post.id,
        slug,
        title: post.title,
        url: post.url,
        image: post.image,
        summary: post.summary,
        publishedAt: post.publishedAt,
        source: post.source,
        tags: post.tags,
        readTime: post.readTime,
        numUpvotes: post.numUpvotes,
        numComments: post.numComments,
        author: post.author,
        commentsPermalink: post.commentsPermalink,
        wing: WINGS[smallest as keyof typeof WINGS].name,
        wingSlug: smallest,
        curatorNote: generateCuratorNote(post),
      });
    }
  }

  console.log(`\n🏛️  Final collection: ${collection.length} exhibits\n`);
  console.log("Distribution:");
  for (const [slug, wing] of Object.entries(WINGS)) {
    const count = collection.filter((e) => e.wingSlug === slug).length;
    console.log(`  ${wing.name}: ${count} exhibits`);
  }

  console.log("\n🌟 Highlights:");
  collection.slice(0, 5).forEach((e) => {
    console.log(`  [${e.numUpvotes}⬆] ${e.wing} → ${e.title.slice(0, 50)}`);
    console.log(`    "${e.curatorNote}"`);
  });

  const outPath = join(__dirname, "..", "data", "collection.json");
  writeFileSync(outPath, JSON.stringify(collection, null, 2));
  console.log(`\n💾 Saved to data/collection.json`);
}

main();
