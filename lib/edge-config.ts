import { get } from '@vercel/edge-config'

interface StoredCode {
  code: string
  createdAt: number
  expiresAt: number
}

export async function setValue(key: string, value: StoredCode): Promise<{ success: boolean; error?: string }> {
  if (!process.env.EDGE_CONFIG_ID || !process.env.VERCEL_API_TOKEN) {
    console.error('Missing required environment variables:', {
      hasEdgeConfigId: !!process.env.EDGE_CONFIG_ID,
      hasVercelApiToken: !!process.env.VERCEL_API_TOKEN
    })
    return {
      success: false,
      error: 'Configuration error: Missing required environment variables'
    }
  }

  try {
    const response = await fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'upsert',
              key,
              value,
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Edge Config API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      return {
        success: false,
        error: `API Error: ${errorData.error?.message || response.statusText}`
      }
    }

    const result = await response.json()
    return { success: true }
  } catch (error) {
    console.error('Edge Config setValue error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to store code'
    }
  }
}

export async function getValue<T>(key: string): Promise<{ success: boolean; data?: T; error?: string }> {
  if (!process.env.EDGE_CONFIG) {
    console.error('Missing EDGE_CONFIG environment variable')
    return {
      success: false,
      error: 'Configuration error: Missing Edge Config connection'
    }
  }

  try {
    const value = await get<T>(key)
    
    if (!value) {
      return {
        success: false,
        error: 'No data found for the given key'
      }
    }

    // Check if the value has expired
    const stored = value as unknown as StoredCode
    if (stored.expiresAt && stored.expiresAt < Date.now()) {
      await deleteValue(key)
      return {
        success: false,
        error: 'Data has expired'
      }
    }

    return {
      success: true,
      data: value
    }
  } catch (error) {
    console.error('Edge Config getValue error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve code'
    }
  }
}

export async function deleteValue(key: string): Promise<{ success: boolean; error?: string }> {
  if (!process.env.EDGE_CONFIG_ID || !process.env.VERCEL_API_TOKEN) {
    console.error('Missing required environment variables for deletion')
    return {
      success: false,
      error: 'Configuration error: Missing required environment variables'
    }
  }

  try {
    const response = await fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'delete',
              key,
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Edge Config deletion error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      return {
        success: false,
        error: `API Error: ${errorData.error?.message || response.statusText}`
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Edge Config deleteValue error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete code'
    }
  }
}

