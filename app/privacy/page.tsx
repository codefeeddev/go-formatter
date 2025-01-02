import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Go Code Formatter',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <h2>Information We Collect</h2>
        <p>When you use our Go code formatter, we do not collect or store any personal information. The code you submit for formatting is processed in memory and is not stored on our servers.</p>
        
        <h2>Analytics</h2>
        <p>We use Vercel Analytics to collect anonymous usage data to help us improve our service. This includes:</p>
        <ul>
          <li>Pages visited</li>
          <li>Web vitals metrics</li>
          <li>Browser type</li>
          <li>Device type</li>
        </ul>
        <p>The analytics data collected is anonymous and cannot be used to identify individual users.</p>
        
        <h2>How We Use Your Information</h2>
        <p>The code you submit is only used to provide the formatting service and is immediately discarded after the response is sent. When using the share feature, your code will be temporarily stored for 24 hours to enable sharing functionality.</p>
        
        <h2>Third-Party Services</h2>
        <p>Our service uses:</p>
        <ul>
          <li>Vercel for hosting and analytics</li>
          <li>Heroku for the formatting API</li>
        </ul>
        <p>These services may collect basic usage metrics like IP addresses and request timestamps.</p>
        
        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us via <a href="https://github.com/codefeeddev/go-formatter" rel="noopener noreferrer">GitHub</a>.</p>
      </div>
    </main>
  )
}

