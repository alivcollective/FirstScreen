import { cn } from '@/lib/utils'

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-slate-200', className)} />
  )
}

export function DiseaseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

export function RiskCalculatorSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-1/4" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <Skeleton className="h-1.5 w-full" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex justify-between pt-2 border-t border-slate-100">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

export function ProviderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <div className="flex gap-1">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ScreeningCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-2.5 w-2.5 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="flex gap-3 ml-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="bg-slate-900 py-20">
      <div className="mx-auto max-w-4xl px-6 text-center space-y-5">
        <Skeleton className="h-6 w-48 rounded-full mx-auto bg-slate-700" />
        <Skeleton className="h-14 w-3/4 mx-auto bg-slate-700" />
        <Skeleton className="h-14 w-2/3 mx-auto bg-slate-700" />
        <Skeleton className="h-5 w-full mx-auto bg-slate-700" />
        <Skeleton className="h-5 w-5/6 mx-auto bg-slate-700" />
        <div className="flex justify-center gap-4 pt-4">
          <Skeleton className="h-14 w-48 rounded-xl bg-slate-700" />
          <Skeleton className="h-14 w-48 rounded-xl bg-slate-700" />
        </div>
      </div>
    </div>
  )
}

export { Skeleton }
