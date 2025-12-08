export default function Page() {

 
  return (
    <section className="max-w-4xl mx-auto my-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg ring-1 ring-black/5">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">Help & Support</h1>
          <p className="mt-2 text-sm text-slate-600">Need help? We’re here 24/7 to assist with any questions or issues.</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="mailto:support@example.com"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-sm hover:scale-[1.02] transition-transform"
            aria-label="Email support"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-4-2-4 2m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6a2 2 0 012 2v4z" />
            </svg>
            support@handcraftedhaven.com
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Intro + Contact */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-900">How we can help</h2>
            <p className="mt-2 text-sm text-slate-600">
              Whether you’re troubleshooting an account issue, tracking an order, or just want to give feedback — reach out and we’ll respond as quickly as possible.
            </p>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <div className="mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884l8 4.8a1 1 0 00.994 0l8-4.8A1 1 0 0018 4H2a1 1 0 00.003 1.884z" />
                    <path d="M18 8.118l-8 4.8a3 3 0 01-2.994 0l-8-4.8V14a2 2 0 002 2h14a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Account issues</p>
                  <p className="text-xs text-slate-600">Password resets, security and profile updates.</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v9a1 1 0 01-1 1h-3.586a1 1 0 00-.707.293L10 19l-2.707-3.707A1 1 0 006.586 15H3a1 1 0 01-1-1V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Orders & Shipping</p>
                  <p className="text-xs text-slate-600">Track orders, returns and delivery times.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* FAQs */}
          <div className="p-5 rounded-xl border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Frequently Asked Questions</h3>

            <div className="mt-4 space-y-3">
              <details className="group bg-white/60 p-3 rounded-md open:shadow-inner">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm font-medium text-slate-900">How do I reset my password?</span>
                  <span className="ml-4 text-xs text-slate-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-2 text-sm text-slate-600">Click the <strong>Forgot Password</strong> link on the login page and follow the instructions sent to your email.</p>
              </details>

              <details className="group bg-white/60 p-3 rounded-md">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm font-medium text-slate-900">Where can I find my order history?</span>
                  <span className="ml-4 text-xs text-slate-500">▼</span>
                </summary>
                <p className="mt-2 text-sm text-slate-600">Open your account dashboard and click <em>Orders</em> to view past purchases and their statuses.</p>
              </details>

              <details className="group bg-white/60 p-3 rounded-md">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm font-medium text-slate-900">How do I contact customer support?</span>
                  <span className="ml-4 text-xs text-slate-500">▼</span>
                </summary>
                <p className="mt-2 text-sm text-slate-600">You can reach us via email at <a href="mailto:support@example.com" className="underline">support@example.com</a> or use the contact form.</p>
              </details>
            </div>
          </div>
        </div>

        {/* Right: Contact card */}
        <aside className="p-5 rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50">
          <h4 className="text-sm font-semibold text-slate-800">Contact support</h4>
          <p className="mt-2 text-xs text-slate-600">Typical response time: within 24 hours.</p>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-indigo-50 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.94 6.34a10 10 0 1114.12 0L10 13 2.94 6.34z" />
                </svg>
              </div>
              <a href="mailto:support@handcraftedhaven.com" className="text-sm font-medium text-indigo-600">support@handcraftedhaven.com</a>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-600">Prefer live chat? Click the chat icon in the bottom-right corner to start a conversation.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
