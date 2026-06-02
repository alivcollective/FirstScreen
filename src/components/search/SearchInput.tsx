'use client'

import { useState, useRef } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Search, X } from 'lucide-react'

export function SearchInput({ initialValue = '' }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}` as Parameters<typeof router.push>[0])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="ค้นหาโรค อาการ การประเมิน บทความ..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          autoFocus={!initialValue}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={() => { setValue(''); inputRef.current?.focus() }}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 transition-colors shrink-0"
      >
        ค้นหา
      </button>
    </form>
  )
}
