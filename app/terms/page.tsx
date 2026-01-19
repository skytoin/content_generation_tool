import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service - Scribengine',
  description: 'Terms of Service for Scribengine - AI-Powered Content Generation Service',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-500 mb-8">Last updated: January 2025</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-slate-600 mb-4">
                By accessing or using Scribengine (&quot;the Service&quot;), operated by MISTTRADES (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
              <p className="text-slate-600">
                Our business address is: 971 US Highway 202 N, Suite N, Branchburg, NJ 08876.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
              <p className="text-slate-600 mb-4">
                Scribengine is an AI-powered content generation platform that learns your unique writing style and brand voice to provide customized:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Blog post and article creation with style learning</li>
                <li>Social media content packages matching your brand voice</li>
                <li>Email sequence generation in your unique tone</li>
                <li>SEO content audits and reports</li>
                <li>Customizable content with tone and format options</li>
                <li>Other content-related services as described on our website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">3. User Accounts</h2>
              <p className="text-slate-600 mb-4">
                To use our Service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Providing accurate and complete registration information</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Payment Terms</h2>
              <p className="text-slate-600 mb-4">
                All payments are processed securely through Stripe. By making a purchase, you agree to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Pay the listed price for selected services</li>
                <li>Provide valid payment information</li>
                <li>Authorize us to charge your payment method</li>
              </ul>
              <p className="text-slate-600 mt-4">
                Prices are listed in US Dollars and are subject to change. Any price changes will not affect orders already placed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Content Ownership and License</h2>
              <p className="text-slate-600 mb-4">
                Upon full payment, you receive full ownership rights to the content generated for you. You may use, modify, publish, and distribute the content as you see fit.
              </p>
              <p className="text-slate-600">
                You grant us permission to use anonymized, non-identifying portions of generated content for the purpose of improving our AI models and services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Acceptable Use</h2>
              <p className="text-slate-600 mb-4">
                You agree not to use our Service to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Generate illegal, harmful, or fraudulent content</li>
                <li>Create content that infringes on intellectual property rights</li>
                <li>Produce spam, phishing materials, or deceptive content</li>
                <li>Generate content promoting violence, hate speech, or discrimination</li>
                <li>Create content that violates any applicable laws or regulations</li>
                <li>Attempt to reverse-engineer or exploit our systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Refunds and Revisions</h2>
              <p className="text-slate-600 mb-4">
                We offer one free revision within 7 days of content delivery. To request a revision, contact us with specific feedback about the changes needed.
              </p>
              <p className="text-slate-600">
                Refunds may be issued at our discretion if we are unable to deliver content that meets the agreed-upon requirements after revision attempts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-slate-600 mb-4">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. We do not guarantee that:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>The Service will be uninterrupted or error-free</li>
                <li>Content will achieve specific business results</li>
                <li>Content will be free from all factual errors (though we strive for accuracy)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-slate-600">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, MISTTRADES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE. Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">10. Indemnification</h2>
              <p className="text-slate-600">
                You agree to indemnify and hold harmless MISTTRADES, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">11. Modifications to Terms</h2>
              <p className="text-slate-600">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the Service. Continued use after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">12. Termination</h2>
              <p className="text-slate-600">
                We may terminate or suspend your account at any time for violations of these Terms. You may close your account at any time by contacting us. Upon termination, your right to use the Service ceases immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">13. Governing Law</h2>
              <p className="text-slate-600">
                These Terms shall be governed by and construed in accordance with the laws of the State of New Jersey, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">14. Contact Information</h2>
              <p className="text-slate-600 mb-4">
                For questions about these Terms, please contact us:
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
