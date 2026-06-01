import { HeroSkeleton } from '@/components/shared/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16 bg-white border-b border-slate-100 animate-pulse" />
      <HeroSkeleton />
      <div className="flex-1 bg-slate-50" />
    </div>
  )
}
