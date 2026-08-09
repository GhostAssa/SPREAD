/**
 * One-time (and re-runnable) import of the original JSON-file data into
 * Postgres. Safe to run repeatedly — every table uses upsert-by-primary-key,
 * so re-running just refreshes existing rows rather than duplicating them.
 */
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/lib/prisma";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function readJson<T>(file: string): T[] {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

async function seedArticles() {
  const rows = readJson<{
    slug: string;
    size: string;
    theme: string;
    category: string;
    chipColor: string;
    verified: boolean;
    title: string;
    excerpt: string;
    authorName: string;
    authorAvatarUrl: string;
    publishedAtLabel: string;
    timeAgoLabel: string;
    heroImageUrl?: string;
    heroImageAlt: string;
    body: unknown;
    breakdown: string[];
    relatedSlug?: string;
    source?: string;
    submissionId?: string;
  }>("articles.json");

  for (const a of rows) {
    const data = {
      size: a.size,
      theme: a.theme,
      category: a.category,
      chipColor: a.chipColor,
      verified: a.verified,
      title: a.title,
      excerpt: a.excerpt,
      authorName: a.authorName,
      authorAvatarUrl: a.authorAvatarUrl,
      publishedAtLabel: a.publishedAtLabel,
      timeAgoLabel: a.timeAgoLabel,
      heroImageUrl: a.heroImageUrl ?? null,
      heroImageAlt: a.heroImageAlt,
      body: a.body as object,
      breakdown: a.breakdown,
      relatedSlug: a.relatedSlug ?? null,
      source: a.source ?? null,
      submissionId: a.submissionId ?? null,
    };
    await prisma.article.upsert({
      where: { slug: a.slug },
      create: { slug: a.slug, ...data },
      update: data,
    });
  }
  console.log(`✓ articles: ${rows.length}`);
}

async function seedFacts() {
  const rows = readJson<{
    id: string;
    status: string;
    category: string;
    chipColor: string;
    title: string;
    body: string;
    sources: string[];
  }>("facts.json");

  for (const f of rows) {
    const data = {
      status: f.status,
      category: f.category,
      chipColor: f.chipColor,
      title: f.title,
      body: f.body,
      sources: f.sources,
    };
    await prisma.fact.upsert({ where: { id: f.id }, create: { id: f.id, ...data }, update: data });
  }
  console.log(`✓ facts: ${rows.length}`);
}

async function seedEvents() {
  const rows = readJson<{
    slug: string;
    title: string;
    date: string;
    location: string;
    category: string;
    chipColor: string;
    description: string;
  }>("events.json");

  for (const e of rows) {
    const data = {
      title: e.title,
      date: e.date,
      location: e.location,
      category: e.category,
      chipColor: e.chipColor,
      description: e.description,
    };
    await prisma.campusEvent.upsert({
      where: { slug: e.slug },
      create: { slug: e.slug, ...data },
      update: data,
    });
  }
  console.log(`✓ events: ${rows.length}`);
}

async function seedTips() {
  const rows = readJson<{
    id: string;
    category: string;
    urgency: string;
    message: string;
    evidenceUrl?: string;
    receivedAt: string;
  }>("tips.json");

  for (const t of rows) {
    const data = {
      category: t.category,
      urgency: t.urgency,
      message: t.message,
      evidenceUrl: t.evidenceUrl ?? null,
      receivedAt: t.receivedAt,
    };
    await prisma.tip.upsert({ where: { id: t.id }, create: { id: t.id, ...data }, update: data });
  }
  console.log(`✓ tips: ${rows.length}`);
}

async function seedContactMessages() {
  const rows = readJson<{ id: string; name: string; email: string; message: string; receivedAt: string }>(
    "contact-messages.json"
  );

  for (const m of rows) {
    const data = { name: m.name, email: m.email, message: m.message, receivedAt: m.receivedAt };
    await prisma.contactMessage.upsert({
      where: { id: m.id },
      create: { id: m.id, ...data },
      update: data,
    });
  }
  console.log(`✓ contact messages: ${rows.length}`);
}

async function seedSubscribers() {
  const rows = readJson<{ email: string; subscribedAt: string }>("newsletter-subscribers.json");

  for (const s of rows) {
    await prisma.subscriber.upsert({
      where: { email: s.email },
      create: s,
      update: { subscribedAt: s.subscribedAt },
    });
  }
  console.log(`✓ newsletter subscribers: ${rows.length}`);
}

async function seedSiteSettings() {
  const raw = path.join(DATA_DIR, "site-settings.json");
  if (!fs.existsSync(raw)) return;
  const settings = JSON.parse(fs.readFileSync(raw, "utf-8")) as {
    tickerItems: string[];
    breakingHeadlines: string[];
  };
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...settings },
    update: settings,
  });
  console.log("✓ site settings");
}

async function seedUsers() {
  const rows = readJson<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    matricNumber?: string;
    walletBalanceNaira: number;
    subscribed: boolean;
    sessionVersion: number;
    createdAt: string;
  }>("users.json");

  for (const u of rows) {
    const data = {
      name: u.name,
      email: u.email,
      passwordHash: u.passwordHash,
      matricNumber: u.matricNumber ?? null,
      walletBalanceNaira: u.walletBalanceNaira,
      subscribed: u.subscribed,
      sessionVersion: u.sessionVersion,
      createdAt: u.createdAt,
    };
    await prisma.user.upsert({ where: { id: u.id }, create: { id: u.id, ...data }, update: data });
  }
  console.log(`✓ users: ${rows.length}`);
}

async function seedSubmissions() {
  const rows = readJson<{
    id: string;
    userId: string;
    authorName: string;
    title: string;
    body: string;
    evidenceNote: string;
    status: string;
    aiReason: string;
    payoutNaira: number;
    submittedAt: string;
    articleSlug?: string;
    overriddenByAdmin?: boolean;
  }>("submissions.json");

  for (const s of rows) {
    const data = {
      userId: s.userId,
      authorName: s.authorName,
      title: s.title,
      body: s.body,
      evidenceNote: s.evidenceNote,
      status: s.status,
      aiReason: s.aiReason,
      payoutNaira: s.payoutNaira,
      submittedAt: s.submittedAt,
      articleSlug: s.articleSlug ?? null,
      overriddenByAdmin: s.overriddenByAdmin ?? false,
    };
    await prisma.newsSubmission.upsert({
      where: { id: s.id },
      create: { id: s.id, ...data },
      update: data,
    });
  }
  console.log(`✓ submissions: ${rows.length}`);
}

async function main() {
  // Users and articles first — submissions/tips reference users, and
  // articles can self-reference via relatedSlug.
  await seedUsers();
  await seedArticles();
  await seedFacts();
  await seedEvents();
  await seedTips();
  await seedContactMessages();
  await seedSubscribers();
  await seedSiteSettings();
  await seedSubmissions();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
