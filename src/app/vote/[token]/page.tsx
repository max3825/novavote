import { Metadata } from 'next'
import VotePage from '@/components/voter/VotePage'

export const metadata: Metadata = {
  title: 'Voter | Platform de Vote',
  description: 'Soumettre votre bulletin de vote',
}

export default function VoteRoute() {
  return <VotePage />
}
