'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { ArticleEditor } from '@/components/admin/ArticleEditor'
import { AdminLayout } from '@/components/admin/AdminLayout'
import type { KmsArticle } from '@/types/kms'

export default function EditArticlePage() {
  const params = useParams()
  const id = params?.id as string
  const [article, setArticle] = useState<KmsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/kms/articles/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.id) setArticle(d); else setError(true) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <AdminLayout title="กำลังโหลด...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
        </div>
      </AdminLayout>
    )
  }

  if (error || !article) {
    return (
      <AdminLayout title="ไม่พบบทความ">
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
          ไม่พบบทความ ID: {id}
        </div>
      </AdminLayout>
    )
  }

  return <ArticleEditor article={article} articleId={id} />
}
