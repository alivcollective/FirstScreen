import type { MetadataRoute } from "next"
import { getAllRichSlugs } from "@/data/diseases/index"
import { getAllDiseaseSlugs } from "@/lib/disease-data"
import { ARTICLES } from "@/data/articles"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://healthcompass.th"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // ── Static pages ─────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/risk`,      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/symptoms`,  lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/diseases`,  lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/screening`, lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/providers`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/academy`,   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`,     lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/trust`,     lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/articles`,  lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
  ]

  // ── Disease pages ─────────────────────────────────────────
  const richSlugs = getAllRichSlugs()
  const allSlugs = [
    ...richSlugs,
    ...getAllDiseaseSlugs().filter(s => !richSlugs.includes(s)),
  ]

  const diseasePages: MetadataRoute.Sitemap = allSlugs.map(slug => ({
    url: `${BASE_URL}/diseases/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: richSlugs.includes(slug) ? 0.85 : 0.7,
  }))

  // ── Article pages ─────────────────────────────────────────
  const articlePages: MetadataRoute.Sitemap = ARTICLES.map(article => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  // ── English locale mirrors (hreflang) ─────────────────────
  const enStaticPages: MetadataRoute.Sitemap = [
    `${BASE_URL}/en`,
    `${BASE_URL}/en/risk`,
    `${BASE_URL}/en/symptoms`,
    `${BASE_URL}/en/diseases`,
  ].map(url => ({
    url,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...diseasePages,
    ...articlePages,
    ...enStaticPages,
  ]
}
