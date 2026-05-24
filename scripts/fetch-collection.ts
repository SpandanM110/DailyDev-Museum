import { config } from "dotenv";
import { writeFileSync } from "fs";
import { join } from "path";

config({ path: join(__dirname, "..", ".env.local") });

const PAT = process.env.DAILY_PAT;
if (!PAT || PAT === "your_token_here") {
  console.error("Set DAILY_PAT in .env.local before running this script.");
  process.exit(1);
}

const BASE = "https://api.daily.dev/public/v1";
const headers = { Authorization: `Bearer ${PAT}`, "Content-Type": "application/json" };

interface FeedPost {
  id: string;
  title: string;
  url: string;
  image: string | null;
  summary: string | null;
  type: string;
  publishedAt: string | null;
  createdAt: string;
  commentsPermalink: string;
  source: { id: string; name: string; handle: string; image: string };
  tags: string[];
  readTime: number | null;
  numUpvotes: number;
  numComments: number;
  author: { name: string; image: string } | null;
}

interface FeedResponse {
  data: FeedPost[];
  pagination?: { cursor?: string; hasNextPage?: boolean };
}

async function fetchEndpoint(path: string, params: Record<string, string> = {}): Promise<FeedResponse> {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    const text = await res.text();
    console.error(`  [${res.status}] ${path}: ${text.slice(0, 200)}`);
    return { data: [] };
  }
  return res.json();
}

async function fetchPaginated(path: string, params: Record<string, string>, pages: number): Promise<FeedPost[]> {
  const all: FeedPost[] = [];
  let cursor: string | undefined;

  for (let i = 0; i < pages; i++) {
    const p = { ...params, limit: "50" };
    if (cursor) p.cursor = cursor;

    const res = await fetchEndpoint(path, p);
    if (!res.data?.length) break;
    all.push(...res.data);
    cursor = res.pagination?.cursor;
    if (!cursor || !res.pagination?.hasNextPage) break;

    // Be respectful with rate limiting
    await sleep(300);
  }
  return all;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Wing-related search queries to get broad topic coverage
const SEARCH_QUERIES = [
  // Frontend Wing
  "react best practices",
  "css tricks",
  "javascript fundamentals",
  "typescript guide",
  "web performance",
  // Backend Hall
  "api design",
  "database optimization",
  "microservices",
  "node.js",
  "system design",
  // AI/ML Pavilion
  "machine learning",
  "large language models",
  "artificial intelligence",
  "neural network",
  "GPT",
  // DevOps Annex
  "docker kubernetes",
  "CI/CD pipeline",
  "cloud infrastructure",
  "terraform",
  "monitoring observability",
  // Languages Gallery
  "rust programming",
  "golang",
  "python tips",
  "java modern",
  // Career & Craft Room
  "software engineer career",
  "code review",
  "technical interview",
  "developer productivity",
  // Tools Workshop
  "git workflow",
  "vscode extensions",
  "developer tools",
  "linux command line",
  // Theory Library
  "algorithms data structures",
  "design patterns",
  "clean architecture",
  "distributed systems",
];

const TAG_QUERIES = [
  "react", "javascript", "typescript", "css", "webdev",
  "python", "rust", "golang", "java",
  "docker", "kubernetes", "devops", "aws",
  "ai", "machine-learning", "llm",
  "career", "productivity", "git",
  "architecture", "algorithms", "database",
];

async function main() {
  console.log("🏛️  The daily.dev Museum — Collection Acquisition Script\n");
  const allPosts = new Map<string, FeedPost>();

  // Strategy 1: Search posts with time=all
  console.log("📚 Strategy 1: Searching by topic keywords (time=all)...");
  for (const q of SEARCH_QUERIES) {
    process.stdout.write(`  Searching: "${q}"...`);
    const res = await fetchEndpoint("/search/posts", { q, time: "all", limit: "50" });
    const count = res.data?.length || 0;
    res.data?.forEach((p) => allPosts.set(p.id, p));
    console.log(` ${count} posts`);
    await sleep(400);
  }

  // Strategy 2: Popular feed pagination
  console.log("\n🔥 Strategy 2: Popular feed (paginated)...");
  const popular = await fetchPaginated("/feeds/popular", {}, 6);
  popular.forEach((p) => allPosts.set(p.id, p));
  console.log(`  Got ${popular.length} posts from popular feed`);

  // Strategy 3: Tag feeds
  console.log("\n🏷️  Strategy 3: Tag-specific feeds...");
  for (const tag of TAG_QUERIES) {
    process.stdout.write(`  Tag: ${tag}...`);
    const res = await fetchPaginated(`/feeds/tag/${tag}`, {}, 2);
    res.forEach((p) => allPosts.set(p.id, p));
    console.log(` ${res.length} posts`);
    await sleep(300);
  }

  // Strategy 4: Keyword recommendations
  console.log("\n💡 Strategy 4: Keyword recommendations (time=all)...");
  const recKeywords = ["best developer articles", "most popular programming", "top software engineering"];
  for (const q of recKeywords) {
    process.stdout.write(`  Recommend: "${q}"...`);
    const res = await fetchEndpoint("/recommend/keyword", { q, time: "all", limit: "20" });
    res.data?.forEach((p) => allPosts.set(p.id, p));
    console.log(` ${res.data?.length || 0} posts`);
    await sleep(400);
  }

  // Deduplicate, filter, and sort
  console.log(`\n✅ Total unique posts collected: ${allPosts.size}`);

  const sorted = [...allPosts.values()]
    .filter((p) => p.type === "article" && p.title && p.url)
    .sort((a, b) => b.numUpvotes - a.numUpvotes);

  console.log(`   Articles with titles & URLs: ${sorted.length}`);
  console.log(`   Top 10 by upvotes:`);
  sorted.slice(0, 10).forEach((p, i) => {
    console.log(`     ${i + 1}. [${p.numUpvotes}⬆] ${p.title.slice(0, 60)}`);
  });

  // Save top 300 candidates
  const candidates = sorted.slice(0, 300).map((p) => ({
    id: p.id,
    title: p.title,
    url: p.url,
    image: p.image,
    summary: p.summary,
    publishedAt: p.publishedAt,
    createdAt: p.createdAt,
    source: p.source,
    tags: p.tags,
    readTime: p.readTime,
    numUpvotes: p.numUpvotes,
    numComments: p.numComments,
    author: p.author,
    commentsPermalink: p.commentsPermalink,
  }));

  const outPath = join(__dirname, "..", "data", "candidates.json");
  writeFileSync(outPath, JSON.stringify(candidates, null, 2));
  console.log(`\n💾 Saved ${candidates.length} candidates to data/candidates.json`);
  console.log("   Next step: curate to 100 and assign to wings.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
