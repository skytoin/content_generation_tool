import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - Scribengine',
  description: 'Privacy Policy for Scribengine - How we collect, use, and protect your data',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-slate-500 mb-8">Last updated: January 2025</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-600 mb-4">
                MISTTRADES (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates Scribengine. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
              <p className="text-slate-600">
                By using Scribengine, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-medium text-slate-800 mb-3 mt-6">Personal Information</h3>
              <p className="text-slate-600 mb-4">
                We may collect personally identifiable information that you voluntarily provide, including:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Name and email address</li>
                <li>Account credentials</li>
                <li>Payment information (processed securely by Stripe)</li>
                <li>Business information you provide for content generation</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-800 mb-3 mt-6">Automatically Collected Information</h3>
              <p className="text-slate-600 mb-4">
                When you access our Service, we may automatically collect:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and location data</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-600 mb-4">
                We use collected information for:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Providing and maintaining our Service</li>
                <li>Processing transactions and sending related information</li>
                <li>Generating content based on your specifications</li>
                <li>Sending administrative information and updates</li>
                <li>Responding to inquiries and providing customer support</li>
                <li>Improving our Service and developing new features</li>
                <li>Analyzing usage patterns to enhance user experience</li>
                <li>Protecting against fraudulent or unauthorized activity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Information Sharing</h2>
              <p className="text-slate-600 mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Service Providers:</strong> Third parties that help us operate our business (payment processors, hosting providers, AI service providers)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
              <p className="text-slate-600 mt-4">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Third-Party Services</h2>
              <p className="text-slate-600 mb-4">
                Our Service uses the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Stripe:</strong> For secure payment processing</li>
                <li><strong>OpenAI:</strong> For AI content generation</li>
                <li><strong>Anthropic:</strong> For AI content generation</li>
                <li><strong>Google OAuth:</strong> For authentication (optional)</li>
              </ul>
              <p className="text-slate-600 mt-4">
                These services have their own privacy policies governing how they handle your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Data Security</h2>
              <p className="text-slate-600 mb-4">
                We implement appropriate security measures to protect your information, including:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Encryption of data in transit (HTTPS/TLS)</li>
                <li>Secure storage of sensitive information</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
              </ul>
              <p className="text-slate-600 mt-4">
                However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Data Retention</h2>
              <p className="text-slate-600">
                We retain your personal information for as long as your account is active or as needed to provide services. We may retain certain information as required by law or for legitimate business purposes (such as maintaining records of transactions).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Your Rights</h2>
              <p className="text-slate-600 mb-4">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict certain processing</li>
                <li>Data portability</li>
                <li>Withdraw consent (where processing is based on consent)</li>
              </ul>
              <p className="text-slate-600 mt-4">
                To exercise these rights, please contact us using the information below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">9. Cookies</h2>
              <p className="text-slate-600 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Analyze how our Service is used</li>
                <li>Improve user experience</li>
              </ul>
              <p className="text-slate-600 mt-4">
                You can control cookies through your browser settings, though disabling cookies may affect Service functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">10. Children&apos;s Privacy</h2>
              <p className="text-slate-600">
                Our Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">11. International Data Transfers</h2>
              <p className="text-slate-600">
                Your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws. By using our Service, you consent to such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">12. Changes to This Policy</h2>
              <p className="text-slate-600">
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">13. Contact Us</h2>
              <p className="text-slate-600 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="text-slate-600 space-y-2">
                <li><strong>Email:</strong> support@misttrades.com</li>
                <li><strong>Phone:</strong> (718) 581-9645</li>
                <li><strong>Address:</strong> 971 US Highway 202 N, Suite N, Branchburg, NJ 08876</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
