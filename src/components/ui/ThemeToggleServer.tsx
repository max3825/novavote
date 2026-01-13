import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

const ThemeToggleClient = dynamic(
  () => import('@/components/ui/ThemeToggleWrapper').then((mod) => ({ default: mod.ThemeToggleWrapper })),
  {
    loading: () => <div className="w-5 h-5" />,
    ssr: false,
  }
)

export function ThemeToggleServer() {
  return <ThemeToggleClient />
}
