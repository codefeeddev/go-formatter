'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Heart } from 'lucide-react'

const DONATION_LINKS = [
  {
    name: 'Buy Me a Coffee',
    url: 'https://buymeacoffee.com/codefeeddev',
    amount: 'Custom',
  },
  {
    name: 'GitHub Sponsors',
    url: 'https://github.com/sponsors/codefeeddev',
    amount: 'Custom',
  },
]

export function DonateButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Heart className="h-4 w-4" />
          <span>Donate</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Support Go Code Formatter</DialogTitle>
          <DialogDescription>
            Your support helps keep this tool free and maintained. Choose a platform to donate:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {DONATION_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <span className="font-medium">{link.name}</span>
              <span className="text-muted-foreground">${link.amount}</span>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

