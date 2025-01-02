import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use - Go Code Formatter',
}

export default function TermsOfUse() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1>Terms of Use</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <h2>1. Terms</h2>
        <p>By accessing this website, you agree to be bound by these terms of use and all applicable laws and regulations.</p>
        
        <h2>2. Use License</h2>
        <p>This is free software. You may use, modify, and distribute it under the MIT License.</p>
        
        <h2>3. Data Storage</h2>
        <p>When using the share feature, your code will be temporarily stored on our servers for 24 hours to enable sharing functionality. After this period, the code will be automatically deleted.</p>
        
        <h2>4. Disclaimer</h2>
        <p>The service is provided "as is" without any warranties of any kind.</p>
        
        <h2>5. Limitations</h2>
        <p>We shall not be liable for any damages arising from the use of this service.</p>
      </div>
    </main>
  )
}

