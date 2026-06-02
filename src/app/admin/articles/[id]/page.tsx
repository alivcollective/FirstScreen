"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { RichEditor } from "@/components/admin/RichEditor"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { Save, ArrowLeft, Send, Eye, Loader2 } from "lucide-react"
import type { KmsArticle, ArticleStatus } from "@/types/kms"
import Link from "next/link"

export default function EditArticlePage() {
  const params = useParams()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<KmsArticle>>({ title_th: "", content: {}, status: "draft" })

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/kms/articles/${params.id}`)
      .then(r => r.json()).then(d => { if (d?.id) setForm(d) })
  }, [params?.id])

  async function save(status?: ArticleStatus) {
    setSaving(true)
    const body = status ? { ...form, status } : form
    const res = await fetch(`/api/kms/articles/${params?.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    })
    setSaving(false)
    if (res.ok) { const d = await res.json(); if (d?.id) setForm(d) }
  }

  return (
    <AdminLayout title={form.title_th ? `แก้ไข: ${form.title_th}` : "แก้ไขบทความ"}>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="flex items-center justify-between gap-3 px-6 py-3 border-b border-slate-800 bg-slate-900 shrink-0">
          <Link href="/admin/articles" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> กลับ
          </Link>
          <div className="flex items-center gap-2">
            {form.status && <StatusBadge status={form.status} />}
            <button onClick={() => save()} disabled={saving} className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} บันทึก
            </button>
            <button onClick={() => save("review")} disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors">
              <Send className="h-3.5 w-3.5" /> ส่งตรวจสอบ
            </button>
            <button onClick={() => save("published")} disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors">
              <Eye className="h-3.5 w-3.5" /> เผยแพร่
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <input value={form.title_th ?? ""} onChange={e => setForm(p => ({ ...p, title_th: e.target.value }))}
              placeholder="หัวข้อบทความ"
              className="w-full text-2xl font-bold bg-transparent border-0 border-b border-slate-800 pb-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500" />
            <input value={form.excerpt_th ?? ""} onChange={e => setForm(p => ({ ...p, excerpt_th: e.target.value }))}
              placeholder="บทสรุป (excerpt)"
              className="w-full text-sm bg-transparent border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500" />
            <RichEditor value={form.content as any} onChange={json => setForm(p => ({ ...p, content: json as any }))} minHeight={500} />
          </div>
          <div className="w-72 shrink-0 border-l border-slate-800 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Slug</label>
              <input value={form.slug ?? ""} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">SEO Title</label>
              <input value={form.seo_title ?? ""} onChange={e => setForm(p => ({ ...p, seo_title: e.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Meta Description</label>
              <textarea value={form.seo_description ?? ""} onChange={e => setForm(p => ({ ...p, seo_description: e.target.value }))}
                rows={3} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">ยอดชม</label>
              <p className="text-sm font-semibold text-white">{form.view_count?.toLocaleString() ?? 0}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">อัปเดตล่าสุด</label>
              <p className="text-xs text-slate-400">{form.updated_at ? new Date(form.updated_at).toLocaleString("th-TH") : "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
