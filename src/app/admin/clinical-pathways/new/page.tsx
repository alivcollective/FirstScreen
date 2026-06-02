import { AdminLayout } from '@/components/admin/AdminLayout'
import { PathwayWizard } from '@/components/admin/pathway/PathwayWizard'

export default function NewPathwayPage() {
  return (
    <AdminLayout title="สร้างเส้นทางใหม่">
      <div className="h-[calc(100vh-3.5rem)] flex flex-col">
        <PathwayWizard />
      </div>
    </AdminLayout>
  )
}
