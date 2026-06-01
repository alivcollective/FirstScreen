// MedicalSchema — Reusable JSON-LD structured data component
// Used on disease pages, article pages, and the homepage
// SAFETY: Schema content must reflect published, verified information only.

import type { RichDisease } from '@/types/disease'
import type { Article } from '@/data/articles'

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string
  url: string
}

interface FAQItem {
  question: string
  answer: string
}

// ────────────────────────────────────────────────────────────
// Generic schema output
// ────────────────────────────────────────────────────────────

function SchemaTag({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 0) }}
    />
  )
}

// ────────────────────────────────────────────────────────────
// 1. MedicalCondition schema (disease pages)
// ────────────────────────────────────────────────────────────

export function MedicalConditionSchema({
  disease,
  baseUrl = 'https://healthcompass.th',
}: {
  disease: RichDisease
  baseUrl?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    '@id': `${baseUrl}/diseases/${disease.slug}`,
    'name': disease.nameTh,
    'alternateName': [disease.nameEn, disease.nameTh_short],
    'description': disease.shortDescriptionTh,
    'url': `${baseUrl}/diseases/${disease.slug}`,
    'code': {
      '@type': 'MedicalCode',
      'code': disease.icd10,
      'codingSystem': 'ICD-10',
    },
    'relevantSpecialty': {
      '@type': 'MedicalSpecialty',
      'name': disease.categoryTh,
    },
    // Symptoms (first 5 for schema)
    ...(disease.symptoms?.length > 0 && {
      'signOrSymptom': disease.symptoms.slice(0, 5).map(s => ({
        '@type': 'MedicalSign',
        'name': s.nameTh,
        'alternateName': s.nameEn,
      })),
    }),
    // Risk factors (first 5 modifiable)
    ...(disease.riskFactors?.length > 0 && {
      'riskFactor': disease.riskFactors.slice(0, 5).map(r => ({
        '@type': 'MedicalRiskFactor',
        'name': r.nameTh,
      })),
    }),
    // Treatments
    ...(disease.treatments?.length > 0 && {
      'possibleTreatment': disease.treatments.slice(0, 3).map(t => ({
        '@type': 'MedicalTherapy',
        'name': t.nameTh,
        'description': t.descriptionTh,
      })),
    }),
    // Prevention
    ...(disease.prevention?.length > 0 && {
      'primaryPrevention': disease.prevention.slice(0, 3).map(p => ({
        '@type': 'MedicalTherapy',
        'name': p.actionTh,
      })),
    }),
    'inLanguage': 'th',
    'publisher': {
      '@type': 'Organization',
      'name': 'Health Compass',
      'url': baseUrl,
    },
    // Medical disclaimer — required for YMYL content
    'disclaimer': 'ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยโรค กรุณาปรึกษาแพทย์',
    'dateModified': `${disease.lastReviewed}-01`,
  }

  return <SchemaTag data={schema} />
}

// ────────────────────────────────────────────────────────────
// 2. FAQPage schema
// ────────────────────────────────────────────────────────────

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs?.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  }

  return <SchemaTag data={schema} />
}

// ────────────────────────────────────────────────────────────
// 3. BreadcrumbList schema
// ────────────────────────────────────────────────────────────

export function BreadcrumbSchema({
  items,
  baseUrl = 'https://healthcompass.th',
}: {
  items: BreadcrumbItem[]
  baseUrl?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': item.name,
      'item': item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  }

  return <SchemaTag data={schema} />
}

// ────────────────────────────────────────────────────────────
// 4. Article schema (health news articles)
// ────────────────────────────────────────────────────────────

export function ArticleSchema({
  article,
  baseUrl = 'https://healthcompass.th',
}: {
  article: Article
  baseUrl?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HealthTopicContent',
    'headline': article.titleTh,
    'description': article.excerptTh,
    'url': `${baseUrl}/articles/${article.slug}`,
    'datePublished': article.date,
    'dateModified': article.date,
    'author': {
      '@type': 'Organization',
      'name': article.author,
      'url': baseUrl,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Health Compass',
      'url': baseUrl,
    },
    'keywords': article.tags.join(', '),
    'inLanguage': 'th',
    'isAccessibleForFree': true,
    'disclaimer': 'ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยโรค',
  }

  return <SchemaTag data={schema} />
}

// ────────────────────────────────────────────────────────────
// 5. WebSite schema (homepage)
// ────────────────────────────────────────────────────────────

export function WebSiteSchema({ baseUrl = 'https://healthcompass.th' }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Health Compass',
    'alternateName': 'Health Compass Thailand',
    'url': baseUrl,
    'description': 'แพลตฟอร์มนำทางสุขภาพเชิงป้องกัน ประเมินความเสี่ยงโรค วางแผนตรวจคัดกรอง ข้อมูลอ้างอิงหลักฐาน',
    'inLanguage': ['th', 'en'],
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${baseUrl}/diseases?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    'sameAs': [
      // Add official social media profiles when available
    ],
  }

  return <SchemaTag data={schema} />
}

// ────────────────────────────────────────────────────────────
// 6. MedicalOrganization schema (about / trust pages)
// ────────────────────────────────────────────────────────────

export function MedicalOrganizationSchema({ baseUrl = 'https://healthcompass.th' }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    'name': 'Health Compass',
    'url': baseUrl,
    'description': 'Health Compass เป็นแพลตฟอร์มข้อมูลสุขภาพเชิงป้องกัน ข้อมูลทุกชิ้นตรวจสอบโดยแพทย์ผู้เชี่ยวชาญ',
    'medicalSpecialty': [
      'Cardiology',
      'Oncology',
      'Endocrinology',
      'Preventive Medicine',
    ],
    'areaServed': {
      '@type': 'Country',
      'name': 'Thailand',
    },
    'inLanguage': ['th', 'en'],
  }

  return <SchemaTag data={schema} />
}
