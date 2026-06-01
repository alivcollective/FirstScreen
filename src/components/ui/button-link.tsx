import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from './button'
import type { VariantProps } from 'class-variance-authority'

interface ButtonLinkProps extends VariantProps<typeof buttonVariants> {
  href: string
  className?: string
  children: React.ReactNode
  external?: boolean
}

export function ButtonLink({ href, className, variant, size, children, external }: ButtonLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant, size }), className)}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)}>
      {children}
    </Link>
  )
}
