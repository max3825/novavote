import { Metadata } from 'next'
import VoteAccessPage from '@/components/voter/VoteAccessPage'

export const metadata: Metadata = {
  title: 'Voter | Platform de Vote',
  description: 'Accédez à votre lien de vote',
}

export default function VotePage() {
  return <VoteAccessPage />
}
