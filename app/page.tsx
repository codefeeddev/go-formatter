import { Metadata } from 'next'
import { GoFormatter } from '@/components/go-formatter'

export const metadata: Metadata = {
  title: 'Go Code Formatter',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <GoFormatter />
      </div>
    </main>
  )
}

