'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface ShareResponse {
  shareId: string
  shareUrl: string
  expiresIn: number
}

interface ErrorResponse {
  error: string
}

export function useShare() {
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  const generateShareUrl = async (code: string): Promise<string | null> => {
    if (!code || code.trim().length === 0) {
      toast({
        title: "Error",
        description: "Cannot share empty code",
        variant: "destructive",
      })
      return null
    }

    setIsSharing(true)
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json() as ShareResponse | ErrorResponse

      if ('error' in data) {
        throw new Error(data.error)
      }

      if (!('shareUrl' in data)) {
        throw new Error('Invalid response format')
      }

      return data.shareUrl
    } catch (error) {
      console.error('Share error:', error)
      toast({
        title: "Share Error",
        description: error instanceof Error ? error.message : "Failed to generate share URL",
        variant: "destructive",
      })
      return null
    } finally {
      setIsSharing(false)
    }
  }

  const getSharedCode = async (shareId: string): Promise<string | null> => {
    if (!shareId) {
      toast({
        title: "Error",
        description: "Share ID is required",
        variant: "destructive",
      })
      return null
    }

    try {
      const response = await fetch(`/api/share?id=${shareId}`)
      const data = await response.json() as { code: string } | ErrorResponse

      if ('error' in data) {
        throw new Error(data.error)
      }

      if (!('code' in data)) {
        throw new Error('Invalid response format')
      }

      return data.code
    } catch (error) {
      console.error('Retrieve error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to retrieve shared code",
        variant: "destructive",
      })
      return null
    }
  }

  return {
    generateShareUrl,
    getSharedCode,
    isSharing,
  }
}

