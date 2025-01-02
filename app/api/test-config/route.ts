import { NextResponse } from 'next/server'
import { setValue, getValue } from '@/lib/edge-config'

export async function GET() {
  try {
    // Test data
    const testData = {
      code: 'package main\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 // 1 hour
    }
    
    // Test write
    const writeSuccess = await setValue('test-key', testData)
    if (!writeSuccess) {
      throw new Error('Failed to write to Edge Config')
    }
    
    // Test read
    const value = await getValue('test-key')
    if (!value) {
      throw new Error('Failed to read from Edge Config')
    }
    
    return NextResponse.json({ 
      success: true,
      value,
      message: 'Edge Config connection successful',
      configId: process.env.EDGE_CONFIG_ID ? 'Present' : 'Missing',
      apiToken: process.env.VERCEL_API_TOKEN ? 'Present' : 'Missing'
    })
  } catch (error) {
    console.error('Edge Config test error:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Edge Config connection failed',
      configId: process.env.EDGE_CONFIG_ID ? 'Present' : 'Missing',
      apiToken: process.env.VERCEL_API_TOKEN ? 'Present' : 'Missing'
    }, { status: 500 })
  }
}

