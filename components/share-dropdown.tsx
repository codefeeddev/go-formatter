'use client'

import { useState } from 'react'
import { Share2, Link2, QrCode, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import QRCode from 'qrcode'

interface ShareDropdownProps {
  code: string
}

export function ShareDropdown({ code }: ShareDropdownProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrCode, setQrCode] = useState<string>('')
  const [shareUrl, setShareUrl] = useState<string>('')
  const { toast } = useToast()

  const generateShareUrl = async () => {
    if (shareUrl) return shareUrl
    
    setIsLoading(true)
    try {
      if (!code || code.trim().length === 0) {
        throw new Error('Cannot share empty code')
      }

      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate share URL')
      }

      if (!data.url) {
        throw new Error('Invalid response: missing URL')
      }
      
      setShareUrl(data.url)
      return data.url
    } catch (error) {
      console.error('Share error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate share URL'
      toast({
        title: "Share Error",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async () => {
    const url = await generateShareUrl()
    if (!url) return

    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard",
      })
    } catch (error) {
      console.error('Copy error:', error)
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleShowQR = async () => {
    const url = await generateShareUrl()
    if (!url) return

    try {
      const qrDataUrl = await QRCode.toDataURL(url)
      setQrCode(qrDataUrl)
      setShowQR(true)
    } catch (error) {
      console.error('QR generation error:', error)
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    const url = await generateShareUrl()
    if (!url) return

    const shareText = 'Check out this Go code snippet:'
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`

    window.open(xUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={isLoading}
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyLink}>
            <Link2 className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShowQR}>
            <QrCode className="mr-2 h-4 w-4" />
            Show QR Code
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>
            <X className="mr-2 h-4 w-4" />
            Share on X
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share QR Code</DialogTitle>
          </DialogHeader>
          {qrCode && (
            <div className="flex justify-center p-4">
              <img src={qrCode} alt="QR Code" className="max-w-full h-auto" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

