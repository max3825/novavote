'use client'

import { useRouter } from 'next/navigation'
import CreateElectionWizard from '@/components/admin/CreateElectionWizard'

export default function CreateElectionPage() {
  const router = useRouter()

  const handleComplete = () => {
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <CreateElectionWizard onComplete={handleComplete} />
    </div>
  )
}
