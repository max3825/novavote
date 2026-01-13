import { Metadata } from 'next'
import ElectionDetails from '@/components/admin/ElectionDetails'

export const metadata: Metadata = {
  title: 'Détails Élection | Platform de Vote',
  description: 'Détails et gestion d\'une élection',
}

export default function ElectionDetailPage() {
  return <ElectionDetails />
}
