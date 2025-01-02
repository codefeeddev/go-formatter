import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'
import Script from 'next/script'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@/components/analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Go Code Formatter',
  description: 'Format your Go code with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = headers().get('x-nonce')

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <Script nonce={nonce} id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Go Code Formatter",
              "description": "Format your Go code with ease",
              "url": "https://codefeeddev.com",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "softwareVersion": "1.0.0",
              "author": {
                "@type": "Organization",
                "name": "Codefeeddev"
              }
            }
          `}
        </Script>
      </body>
    </html>
  )
}

