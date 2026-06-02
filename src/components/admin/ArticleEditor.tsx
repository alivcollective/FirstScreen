'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Save, ArrowLeft, Send, Eye, Loader2, Globe,
  Tag, Clock, Image, User, BookOpen, ShieldCheck,
  ChevronDown, ChevronUp, ExternalLink,
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { RichEditor } from '@/components/admin/RichEditor'
import { StatusBadge } from '@/components/admin/StatusBadge'
import type { KmsArticle, KmsArticleInput, ArticleStatus, EvidenceLevel } from '@/types/kms'
import { cn } from '@/lib/utils'

// ── Category options ─────────────────────────────────────────

const CATEGORIES = [
  { value: 'general',           label: 'สุขภาพทั่วไป' },
  { value: 'cancer',            label: 'มะเร็ง' },
  { value: 'heart',             label: 'โรคหัวใจ' },
  { value: 'diabetes',          label: 'เบาหวาน' },
  { value: 'mental-health',     label: 'สุขภาพจิต' },
  { value: 'sleep',             label: 'การนอนหลับ' },
  { value: 'nutrition',         label: 'โภชนาการ' },
  { value: 'exercise',          label: 'การออกกำลังกาย' },
  { value: 'screening',         label: 'การคัดกรอง' },
  { value: 'athlete',           label: 'นักกีฬา' },
  { value: 'running',           label: 'วิ่ง' },
  { value: 'weight-training',   label: 'เวทเทรนนิ่ง' },
  { value: 'injury-prevention', label: 'ป้องกันการบาดเจ็บ' },
] as const

const EVIDENCE_LEVELS: { value: EvidenceLevel; label: string }[] = [
  { value: 'high',        label: 'สูง (RCT / Systematic Reviews)' },
  { value: 'moderate',    label: 'ปานกลาง (Cohort Studies)' },
  { value: 'low',         label: 'ต่ำ (Observational)' },
  { value: 'insufficient', label: 'ไม่เพียงพอ' },
]

// ── Input / Textarea helpers ──────────────────────────────────

const inputCls = 'w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors'
const labelCls = 'block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide'

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  )
}

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
      >
        <Icon className="h-4 w-4 text-teal-400" />
        {title}
        {open
          ? <ChevronUp className="h-3.5 w-3.5 ml-auto text-slate-500" />
          : <ChevronDown className="h-3.5 w-3.5 ml-auto text-slate-500" />
        }
      </button>
      {open && <div className="px-4 pb-4 space-y-4 border-t border-slate-700/60 pt-4">{children}</div>}
    </div>
  )
}

// ── Auto-generate slug from Thai title ────────────────────────

function thaiToSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[฀-๿]+/g, m => encodeURIComponent(m).replace(/%/g, '').toLowerCase())
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || `article-${Date.now()}`
}

// ── Main Editor ───────────────────────────────────────────────

interface ArticleEditorProps {
  article?: KmsArticle        // provided when editing
  articleId?: string
}

export function ArticleEditor({ article, articleId }: ArticleEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [slugManual, setSlugManual] = useState(false)

  const [form, setForm] = useState<KmsArticleInput>(() => ({
    title_th: article?.title_th ?? '',
    title_en: article?.title_en ?? '',
    slug: article?.slug ?? '',
    excerpt_th: article?.excerpt_th ?? '',
    excerpt_en: article?.excerpt_en ?? '',
    content: article?.content ?? {},
    category_id: article?.category_id ?? '',
    tags: article?.tags ?? [],
    status: article?.status ?? 'draft',
    author_name: (article as KmsArticle & { author_name?: string })?.author_name ?? '',
    reviewed_by: (article as KmsArticle & { reviewed_by?: string })?.reviewed_by ?? '',
    medical_reviewer: (article as KmsArticle & { medical_reviewer?: string })?.medical_reviewer ?? '',
    references: (article as KmsArticle & { references?: string })?.references ?? '',
    cover_image_url: article?.og_image_url ?? '',
    seo_title: article?.seo_title ?? '',
    seo_description: article?.seo_description ?? '',
    og_image_url: article?.og_image_url ?? '',
    read_time_minutes: article?.read_time_minutes ?? 5,
    evidence_level: article?.evidence_level ?? 'moderate',
    is_featured: article?.is_featured ?? false,
  }))

  const patch = useCallback(<K extends keyof KmsArticleInput>(key: K, value: KmsArticleInput[K]) => {
    setForm(p => ({ ...p, [key]: value }))
  }, [])

  // Auto-slug from Thai title (only when not manually set)
  useEffect(() => {
    if (!slugManual && form.title_th && !articleId) {
      patch('slug', thaiToSlug(form.title_th))
    }
  }, [form.title_th, slugManual, articleId, patch])

  async function save(status?: ArticleStatus) {
    setSaving(true)
    setSaveMsg('')
    try {
      const body = { ...form, ...(status ? { status } : {}) }
      const url = articleId ? `/api/kms/articles/${articleId}` : '/api/kms/articles'
      const method = articleId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const d = await res.json()
        setSaveMsg(status === 'published' ? 'เผยแพร่แล้ว' : 'บันทึกแล้ว')
        if (!articleId && d.id) {
          router.push(`/admin/articles/${d.id}`)
        } else {
          patch('status', status ?? form.status ?? 'draft')
        }
      } else {
        setSaveMsg('เกิดข้อผิดพลาด')
      }
    } catch {
      setSaveMsg('เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }

  const tagsStr = (form.tags ?? []).join(', ')

  return (
    <AdminLayout title={articleId ? `แก้ไข: ${form.title_th || '...'}` : 'บทความใหม่'}>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">

        {/* Top bar */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-3 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/articles"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors shrink-0">
              <ArrowLeft className="h-4 w-4" /> กลับ
            </Link>
            {form.status && <StatusBadge status={form.status} />}
            {saveMsg && (
              <span className="text-xs text-teal-400 font-medium animate-pulse">{saveMsg}</span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => save()} disabled={saving}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 hover:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              บันทึกร่าง
            </button>
            <button onClick={() => save('review')} disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors">
              <Send className="h-3.5 w-3.5" /> ส่งตรวจสอบ
            </button>
            <button onClick={() => save('published')} disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
              เผยแพร่
            </button>
            {articleId && form.slug && (
              <Link href={`/articles/${form.slug}`} target="_blank"
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 hover:border-teal-500 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-teal-300 transition-colors">
                <ExternalLink className="h-3.5 w-3.5" /> Preview
              </Link>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex-1 min-h-0 flex overflow-hidden">

          {/* Main content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">

            {/* Title TH */}
            <input
              value={form.title_th}
              onChange={e => patch('title_th', e.target.value)}
              placeholder="หัวข้อบทความ (ภาษาไทย) *"
              className="w-full text-2xl font-bold bg-transparent border-0 border-b border-slate-800 pb-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />

            {/* Title EN */}
            <input
              value={form.title_en ?? ''}
              onChange={e => patch('title_en', e.target.value)}
              placeholder="Article title (English)"
              className="w-full text-base bg-transparent border-0 border-b border-slate-800/60 pb-2 text-slate-400 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors"
            />

            {/* Excerpt TH */}
            <textarea
              value={form.excerpt_th ?? ''}
              onChange={e => patch('excerpt_th', e.target.value)}
              placeholder="บทสรุปสั้นๆ ภาษาไทย (แสดงในการ์ดบทความ)"
              rows={2}
              className={inputCls + ' resize-none'}
            />

            {/* Excerpt EN */}
            <textarea
              value={form.excerpt_en ?? ''}
              onChange={e => patch('excerpt_en', e.target.value)}
              placeholder="Short excerpt in English"
              rows={2}
              className={inputCls + ' resize-none'}
            />

            {/* Rich Text Editor */}
            <div>
              <p className={labelCls}>เนื้อหาบทความ</p>
              <RichEditor
                value={form.content}
                onChange={(json) => patch('content', json)}
                minHeight={450}
              />
            </div>

            {/* References */}
            <CollapsibleSection title="แหล่งอ้างอิง" icon={BookOpen}>
              <textarea
                value={form.references ?? ''}
                onChange={e => patch('references', e.target.value)}
                placeholder={`1. WHO (2023). Title...\n2. USPSTF (2022). Title...\n3. กรมการแพทย์ (2565). ชื่อแนวทาง...`}
                rows={5}
                className={inputCls + ' resize-none font-mono text-xs leading-relaxed'}
              />
            </CollapsibleSection>

          </div>

          {/* Sidebar */}
          <div className="w-80 shrink-0 border-l border-slate-800 overflow-y-auto bg-slate-900/40">
            <div className="p-4 space-y-4">

              {/* Slug */}
              <Field label="Slug (URL)">
                <input
                  value={form.slug ?? ''}
                  onChange={e => { setSlugManual(true); patch('slug', e.target.value) }}
                  placeholder="url-slug"
                  className={inputCls}
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  /articles/<span className="text-teal-400">{form.slug || '...'}</span>
                </p>
              </Field>

              {/* Category */}
              <Field label="หมวดหมู่">
                <select
                  value={form.category_id ?? ''}
                  onChange={e => patch('category_id', e.target.value)}
                  className={inputCls + ' cursor-pointer'}
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </Field>

              {/* Tags */}
              <Field label="แท็ก">
                <input
                  value={tagsStr}
                  onChange={e => patch('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder="มะเร็ง, ป้องกัน, ตรวจคัดกรอง"
                  className={inputCls}
                />
                <p className="text-[10px] text-slate-500 mt-1">คั่นด้วยจุลภาค</p>
              </Field>

              {/* Reading time */}
              <Field label="เวลาอ่าน (นาที)">
                <input
                  type="number" min={1} max={60}
                  value={form.read_time_minutes ?? 5}
                  onChange={e => patch('read_time_minutes', parseInt(e.target.value) || 5)}
                  className={inputCls}
                />
              </Field>

              {/* Cover image */}
              <Field label="ภาพปก (URL)">
                <input
                  value={form.cover_image_url ?? ''}
                  onChange={e => { patch('cover_image_url', e.target.value); patch('og_image_url', e.target.value) }}
                  placeholder="https://..."
                  className={inputCls}
                />
              </Field>

              {/* Author / Reviewer */}
              <CollapsibleSection title="ผู้เขียนและตรวจสอบ" icon={User}>
                <Field label="ผู้เขียน">
                  <input value={form.author_name ?? ''}
                    onChange={e => patch('author_name', e.target.value)}
                    placeholder="นพ./พญ. ชื่อ นามสกุล"
                    className={inputCls} />
                </Field>
                <Field label="ตรวจสอบโดย">
                  <input value={form.reviewed_by ?? ''}
                    onChange={e => patch('reviewed_by', e.target.value)}
                    placeholder="ชื่อแพทย์ผู้ตรวจสอบ"
                    className={inputCls} />
                </Field>
                <Field label="แพทย์รับรองเนื้อหา">
                  <input value={form.medical_reviewer ?? ''}
                    onChange={e => patch('medical_reviewer', e.target.value)}
                    placeholder="Medical reviewer"
                    className={inputCls} />
                </Field>
                <Field label="วันที่ตรวจสอบ">
                  <input type="date"
                    value={form.review_date ?? ''}
                    onChange={e => patch('review_date', e.target.value)}
                    className={inputCls} />
                </Field>
                <Field label="ระดับหลักฐาน">
                  <select value={form.evidence_level ?? 'moderate'}
                    onChange={e => patch('evidence_level', e.target.value as EvidenceLevel)}
                    className={inputCls + ' cursor-pointer'}>
                    {EVIDENCE_LEVELS.map(ev => (
                      <option key={ev.value} value={ev.value}>{ev.label}</option>
                    ))}
                  </select>
                </Field>
              </CollapsibleSection>

              {/* SEO */}
              <CollapsibleSection title="SEO" icon={Globe}>
                <Field label="SEO Title">
                  <input value={form.seo_title ?? ''}
                    onChange={e => patch('seo_title', e.target.value)}
                    placeholder="Title สำหรับ Google"
                    className={inputCls} />
                  <p className="text-[10px] text-slate-500 mt-1">
                    {(form.seo_title ?? '').length}/60 ตัวอักษร
                  </p>
                </Field>
                <Field label="Meta Description">
                  <textarea value={form.seo_description ?? ''}
                    onChange={e => patch('seo_description', e.target.value)}
                    rows={3} placeholder="Description สำหรับ Google"
                    className={inputCls + ' resize-none'} />
                  <p className="text-[10px] text-slate-500 mt-1">
                    {(form.seo_description ?? '').length}/160 ตัวอักษร
                  </p>
                </Field>
                <Field label="Canonical URL">
                  <input value={form.canonical_url ?? ''}
                    onChange={e => patch('canonical_url', e.target.value)}
                    placeholder="https://firstscreen.health/articles/..."
                    className={inputCls} />
                </Field>
              </CollapsibleSection>

              {/* Options */}
              <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3">
                <span className="text-xs font-semibold text-slate-300">แนะนำบทความ</span>
                <button
                  type="button"
                  onClick={() => patch('is_featured', !form.is_featured)}
                  className={cn(
                    'relative w-10 h-5 rounded-full transition-colors',
                    form.is_featured ? 'bg-teal-500' : 'bg-slate-600'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                    form.is_featured ? 'translate-x-5' : 'translate-x-0.5'
                  )} />
                </button>
              </div>

              {/* Medical Disclaimer reminder */}
              <div className="rounded-xl border border-amber-700/30 bg-amber-900/10 p-3">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-300/80 leading-relaxed">
                    ทุกบทความจะแสดง disclaimer อัตโนมัติ:
                    "ข้อมูลนี้ใช้เพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยโรค"
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
