import fs from "node:fs";
import path from "node:path";
import type { Article } from "@/lib/types";

const DATA_PATH = path.join(process.cwd(), "src", "data", "articles.json");

export function getArticles(): Article[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Article[];
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function getHomepageFeature(): Article | undefined {
  return getArticles().find((a) => a.size === "feature");
}

export function getHomepageCompacts(): Article[] {
  return getArticles()
    .filter((a) => a.size === "compact")
    .slice(0, 2);
}

export function saveArticle(article: Article): void {
  const articles = getArticles();
  const existingIndex = articles.findIndex((a) => a.slug === article.slug);
  if (existingIndex >= 0) {
    articles[existingIndex] = article;
  } else {
    articles.unshift(article);
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2) + "\n", "utf-8");
}

export function deleteArticle(slug: string): void {
  const articles = getArticles().filter((a) => a.slug !== slug);
  fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2) + "\n", "utf-8");
}
