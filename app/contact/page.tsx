import Link from 'next/link'

export const metadata = {
  title: 'Contact Us - Scribengine',
  description: 'Get in touch with the Scribengine team. We are here to help with your content needs.',
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-xl text-slate-600">
            Have questions? We&apos;re here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                  <a href="mailto:support@misttrades.com" className="text-primary-600 hover:text-primary-700">
                    support@misttrades.com
                  </a>
                  <p className="text-sm text-slate-500 mt-1">We typically respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                  <a href="tel:+17185819645" className="text-primary-600 hover:text-primary-700">
                    (718) 581-9645
                  </a>
                  <p className="text-sm text-slate-500 mt-1">Monday - Friday, 9am - 5pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Address</h3>
                  <p className="text-slate-600">
                    MISTTRADES<br />
                    971 US Highway 202 N, Suite N<br />
                    Branchburg, NJ 08876<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Quick Links */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Help</h2>

            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-semibold text-slate-900 mb-2">How do I get started?</h3>
                <p className="text-slate-600 text-sm">
                  Simply create an account, choose a service, and fill out the brief form. We&apos;ll handle the rest!
                </p>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-semibold text-slate-900 mb-2">What&apos;s the turnaround time?</h3>
                <p className="text-slate-600 text-sm">
                  Most content is delivered within 24-72 hours. Complex projects may take longer.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-semibold text-slate-900 mb-2">Can I request revisions?</h3>
                <p className="text-slate-600 text-sm">
                  Yes! We offer one free revision within 7 days of delivery.
                </p>
              </div>

              <div className="pb-4">
                <h3 className="font-semibold text-slate-900 mb-2">Need more help?</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Check out our FAQ section for more answers.
                </p>
                <Link href="/#faq" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  View FAQ &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mt-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Business Hours</h2>
          <p className="text-white/80 mb-6">
            Our support team is available during the following hours:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div>
              <div className="font-semibold">Mon - Fri</div>
              <div className="text-white/70">9am - 5pm EST</div>
            </div>
            <div>
              <div className="font-semibold">Saturday</div>
              <div className="text-white/70">10am - 2pm EST</div>
            </div>
            <div>
              <div className="font-semibold">Sunday</div>
              <div className="text-white/70">Closed</div>
            </div>
            <div>
              <div className="font-semibold">Holidays</div>
              <div className="text-white/70">Closed</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
