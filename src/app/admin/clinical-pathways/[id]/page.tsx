'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PathwayWizard } from '@/components/admin/pathway/PathwayWizard'
import { Loader2 } from 'lucide-react'
import type { ClinicalPathway } from '@/types/clinical-pathway'

export default function EditPathwayPage() {
  const params = useParams()
  const [pathway, setPathway] = useState<ClinicalPathway | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/admin/pathways/${params.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setPathway(d))
      .finally(() => setLoading(false))
  }, [params?.id])

  if (loading) return (
    <AdminLayout title="กำลังโหลด...">
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
      </div>
    </AdminLayout>
  )

  if (!pathway) return (
    <AdminLayout title="ไม่พบข้อมูล">
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] text-slate-400 text-sm">
        ไม่พบเส้นทางนี้
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout title={`แก้ไข: ${pathway.name_th}`}>
      <div className="h-[calc(100vh-3.5rem)] flex flex-col">
        <PathwayWizard initialDraft={pathway} pathwayId={pathway.id} />
      </div>
    </AdminLayout>
  )
}
