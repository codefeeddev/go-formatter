import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { setValue, getValue } from '@/lib/edge-config'

// Duration in milliseconds (24 hours)
const EXPIRATION_TIME = 24 * 60 * 60 * 1000

export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json()
    
    if (!body || typeof body.code !== 'string') {
      console.error('Invalid request body:', { body })
      return NextResponse.json(
        { error: 'Invalid request: code must be a string' },
        { status: 400 }
      )
    }

    const { code } = body

    if (code.trim().length === 0) {
      return NextResponse.json(
        { error: 'Code cannot be empty' },
        { status: 400 }
      )
    }

    const shareId = nanoid(10)
    const stored = {
      code,
      createdAt: Date.now(),
      expiresAt: Date.now() + EXPIRATION_TIME
    }

    const { success, error } = await setValue(shareId, stored)
    if (!success) {
      console.error('Failed to store code:', error)
      return NextResponse.json(
        { error: error || 'Failed to store code' },
        { status: 500 }
      )
    }

    // Get origin with fallback
    const origin = request.headers.get('origin') || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const shareUrl = `${origin}/share/${shareId}`

    return NextResponse.json({
      shareId,
      url: shareUrl,
      expiresIn: EXPIRATION_TIME
    })
  } catch (error) {
    console.error('Share error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate share URL' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const shareId = url.searchParams.get('id')

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      )
    }

    const { success, data, error } = await getValue<{
      code: string
      createdAt: number
      expiresAt: number
    }>(shareId)

    if (!success || !data) {
      console.error('Failed to retrieve shared code:', error)
      return NextResponse.json(
        { error: error || 'Shared code not found or expired' },
        { status: 404 }
      )
    }

    // Double-check expiration
    if (data.expiresAt < Date.now()) {
      return NextResponse.json(
        { error: 'Shared code has expired' },
        { status: 404 }
      )
    }

    return NextResponse.json({ code: data.code })
  } catch (error) {
    console.error('Retrieve error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve shared code' },
      { status: 500 }
    )
  }
}

