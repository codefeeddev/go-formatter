import { getValue } from '@/lib/edge-config'
import { GoFormatter } from '@/components/go-formatter'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface SharePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  return {
    title: 'Shared Go Code - Go Code Formatter',
    description: 'View and format shared Go code',
  }
}

export default async function SharePage({ params }: SharePageProps) {
  try {
    const { success, data, error } = await getValue<{
      code: string
      createdAt: number
      expiresAt: number
    }>(params.id)

    if (!success || !data) {
      console.error('Failed to retrieve shared code:', error)
      notFound()
    }

    if (data.expiresAt < Date.now()) {
      console.error('Shared code has expired')
      notFound()
    }

    return (
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <GoFormatter initialCode={data.code} />
        </div>
      </main>
    )
  } catch (error) {
    console.error('Share page error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    notFound()
  }
}

