import { Suspense } from 'react'
import { AdminLoginForm } from './LoginForm'

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}
