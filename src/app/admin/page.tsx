import { Metadata } from 'next'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Platform de Vote',
  description: 'Gestion des élections et surveillance en temps réel',
}

export default function AdminPage() {
  return <AdminDashboard />
}
