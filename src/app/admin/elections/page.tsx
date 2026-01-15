import { Metadata } from 'next'
import { ElectionsList } from '@/components/admin/ElectionsList'

export const metadata: Metadata = {
  title: 'Élections | NovaVote Admin',
  description: 'Gestion des élections',
}

export default function ElectionsPage() {
  return <ElectionsList />
}
