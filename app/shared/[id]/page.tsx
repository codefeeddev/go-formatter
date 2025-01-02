import { kv } from '@vercel/kv'
import { GoFormatter } from '@/components/go-formatter'
import { notFound } from 'next/navigation'

interface SharedPageProps {
  params: {
    id: string
  }
}

export default async function SharedPage({ params }: SharedPageProps) {
  const code = await kv.get<string>(params.id)
  
  if (!code) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <GoFormatter initialCode={code} />
      </div>
    </main>
  )
}

