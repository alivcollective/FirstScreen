'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatusBadge } from '@/components/admin/StatusBadge'
import {
  Plus, Search, Filter, Pencil, Eye, Copy,
  MapPin, Activity, Users, Calendar, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ClinicalPathway, PathwayStatus } from '@/types/clinical-pathway'

const STATUS_CONFIG: Record<PathwayStatus, { label: string; color: string }> = {
  draft:     { label: 'ร่าง',          color: 'bg-slate-700 text-slate-300' },
  review:    { label: 'รอตรวจสอบ',     color: 'bg-amber-900/50 text-amber-300 border border-amber-700/40' },
  approved:  { label: 'อนุมัติแล้ว',   color: 'bg-blue-900/50 text-blue-300 border border-blue-700/40' },
  published: { label: 'เผยแพร่',        color: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/40' },
  archived:  { label: 'เก็บถาวร',      color: 'bg-slate-800 text-slate-500' },
}

function PathwayStatusBadge({ status }: { status: PathwayStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold', cfg.color)}>
      {cfg.label}
    </span>
  )
}

// ── Pathway Card (grid view) ──────────────────────────────────

function PathwayCard({ pathway }: { pathway: ClinicalPathway }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition-colors group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <Link href={`/admin/clinical-pathways/${pathway.id}`}
            className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
            {pathway.name_th}
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">{pathway.specialty}</p>
        </div>
        <PathwayStatusBadge status={pathway.status} />
      </div>

      {pathway.description_th && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
          {pathway.description_th}
        </p>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
        {pathway.body_regions?.length > 0 && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {pathway.body_regions.length} บริเวณ
          </span>
        )}
        {pathway.conditions?.length > 0 && (
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {pathway.conditions.length} ภาวะ
          </span>
        )}
        {pathway.questions?.length > 0 && (
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {pathway.questions.length} คำถาม
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-[11px] text-slate-600">
          <Calendar className="h-3 w-3" />
          {new Date(pathway.updated_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/admin/clinical-pathways/${pathway.id}/preview`}
            className="p-1.5 rounded text-slate-500 hover:text-teal-400 hover:bg-slate-800 transition-colors" title="Preview">
            <Eye className="h-3.5 w-3.5" />
          </Link>
          <Link href={`/admin/clinical-pathways/${pathway.id}`}
            className="p-1.5 rounded text-slate-500 hover:text-teal-400 hover:bg-slate-800 transition-colors" title="แก้ไข">
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────

const SPECIALTY_FILTERS = [
  'ทั้งหมด', 'เวชศาสตร์ทั่วไป', 'อายุรศาสตร์โรคหัวใจ',
  'ออร์โธปิดิกส์', 'เวชศาสตร์การกีฬา', 'เวชศาสตร์ฟื้นฟู',
]

// Demo data for initial UI (will be replaced by API data)
const DEMO_PATHWAYS: ClinicalPathway[] = [
  {
    id: 'demo-1', slug: 'scapular-pain-pathway', name_th: 'ปวดสะบักและไหล่',
    specialty: 'ออร์โธปิดิกส์', status: 'published', version: 2, is_public: true,
    description_th: 'เส้นทางการประเมินอาการปวดสะบัก ไหล่ และคอ สำหรับนักกีฬาและบุคคลทั่วไป',
    body_regions: [{ id: '1', region_slug: 'scapula', region_name_th: 'สะบัก', sort_order: 0 }],
    symptoms: [{ id: '1', symptom_slug: 'pain', name_th: 'ปวด', is_primary: true, is_custom: false, sort_order: 0 }],
    questions: [{ id: '1', question_th: 'เจ็บเมื่อยกแขนหรือไม่?', question_type: 'yes_no', is_required: true, options: [], sort_order: 0 }],
    conditions: [{ id: '1', condition_slug: 'scapular-dyskinesis', condition_name_th: 'Scapular Dyskinesis', strength: 'strongly_suggests', sort_order: 0 }],
    red_flags: [], recommendations: [], references: [], translations: [], links: [],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2', slug: 'knee-pain-runner', name_th: "Runner's Knee",
    specialty: 'เวชศาสตร์การกีฬา', status: 'review', version: 1, is_public: false,
    description_th: 'ประเมินอาการปวดเข่าในนักวิ่ง รวมถึง IT Band และ Patellofemoral Pain',
    body_regions: [{ id: '2', region_slug: 'knee', region_name_th: 'เข่า', sort_order: 0 }],
    symptoms: [{ id: '2', symptom_slug: 'pain', name_th: 'ปวด', is_primary: true, is_custom: false, sort_order: 0 }],
    questions: [],
    conditions: [{ id: '2', condition_slug: 'runners-knee', condition_name_th: "Runner's Knee", strength: 'supports', sort_order: 0 }],
    red_flags: [], recommendations: [], references: [], translations: [], links: [],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-3', slug: 'low-back-pain', name_th: 'ปวดหลังส่วนล่าง',
    specialty: 'เวชศาสตร์ฟื้นฟู', status: 'draft', version: 1, is_public: false,
    description_th: 'ประเมินอาการปวดหลังส่วนล่าง ค้นหาสาเหตุและให้คำแนะนำเบื้องต้น',
    body_regions: [{ id: '3', region_slug: 'low_back', region_name_th: 'หลังส่วนล่าง', sort_order: 0 }],
    symptoms: [],
    questions: [],
    conditions: [],
    red_flags: [{ id: '1', name_th: 'ชาขา', description_th: 'อาจมีเส้นประสาทถูกกด', emergency_level: 'see_doctor_today', sort_order: 0 }],
    recommendations: [], references: [], translations: [], links: [],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
]

export default function ClinicalPathwaysPage() {
  const [pathways, setPathways] = useState<ClinicalPathway[]>(DEMO_PATHWAYS)
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('ทั้งหมด')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/admin/pathways?' + new URLSearchParams({ search, specialty: specialty === 'ทั้งหมด' ? '' : specialty }))
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => {
        if (d.data?.length > 0) setPathways(d.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, specialty])

  const filtered = pathways.filter(p => {
    const matchSearch = !search || p.name_th.includes(search) || p.specialty.includes(search)
    const matchSpec = specialty === 'ทั้งหมด' || p.specialty === specialty
    return matchSearch && matchSpec
  })

  return (
    <AdminLayout title="Clinical Pathway Builder">
      <div className="p-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">เส้นทางการประเมินคลินิก</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              สร้างเส้นทางการประเมินแบบที่แพทย์คิด — ระบบจัดการกฎเกณฑ์เองเบื้องหลัง
            </p>
          </div>
          <Link href="/admin/clinical-pathways/new"
            className="flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors whitespace-nowrap">
            <Plus className="h-4 w-4" />
            สร้างเส้นทางใหม่
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาเส้นทาง..."
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {SPECIALTY_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={cn(
                  'shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                  specialty === s
                    ? 'bg-teal-600 border-teal-600 text-white'
                    : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{filtered.length} เส้นทาง</span>
          <span className="text-slate-700">·</span>
          <span className="text-emerald-400">{filtered.filter(p => p.status === 'published').length} เผยแพร่แล้ว</span>
          <span className="text-amber-400">{filtered.filter(p => p.status === 'review').length} รอตรวจสอบ</span>
          <span className="text-slate-400">{filtered.filter(p => p.status === 'draft').length} ร่าง</span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 animate-pulse">
                <div className="h-4 bg-slate-700 rounded mb-3 w-3/4" />
                <div className="h-3 bg-slate-800 rounded mb-2 w-1/2" />
                <div className="h-3 bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-400">ยังไม่มีเส้นทางการประเมิน</p>
            <p className="text-xs text-slate-600 mt-1 mb-5">เริ่มสร้างเส้นทางแรกของคุณ</p>
            <Link href="/admin/clinical-pathways/new"
              className="flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors">
              <Plus className="h-4 w-4" />
              สร้างเส้นทางใหม่
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <PathwayCard key={p.id} pathway={p} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
