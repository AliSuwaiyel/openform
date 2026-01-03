'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ href = '/', size = 'md', className }: LogoProps) {
  const sizes = {
    sm: { width: 100, height: 32 },
    md: { width: 130, height: 42 },
    lg: { width: 160, height: 52 },
  }

  const content = (
    <Image
      src="/logo.png"
      alt="OpenForm"
      width={sizes[size].width}
      height={sizes[size].height}
      className={cn(
        'hover:opacity-80 transition-opacity',
        className
      )}
      priority
    />
  )

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
        {content}
      </Link>
    )
  }

  return content
}
