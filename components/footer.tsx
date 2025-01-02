import Link from 'next/link'
import { DonateButton } from './donate-button'

export function Footer() {
  return (
    <footer className="sticky bottom-0 border-t mt-8 bg-background">
      <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 w-full sm:w-auto">
          <span className="text-sm text-muted-foreground order-1 sm:order-none">
            © {new Date().getFullYear()} Codefeeddev
          </span>
          <DonateButton />
        </div>
        <nav className="flex flex-wrap justify-center sm:justify-end gap-4 w-full sm:w-auto">
          <Link 
            href="/privacy" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/terms" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            rel="noopener noreferrer"
          >
            Terms of Use
          </Link>
        </nav>
      </div>
    </footer>
  )
}

