import React from "react";

export default function Page() {
  return (
    <section className="max-w-4xl mx-auto my-12 p-6 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white/80 backdrop-blur shadow ring-1 ring-black/5">
        <h1 className="text-3xl font-extrabold text-slate-900">Messages</h1>
        <p className="mt-2 text-sm text-slate-600">
          This is your message center where you can view and manage all your conversations.
        </p>
      </div>

      {/* Messages List */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-white to-slate-50 shadow ring-1 ring-black/5">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Your Messages</h2>

        <ul className="divide-y divide-slate-200">
          <li className="py-4 flex items-start gap-3 hover:bg-slate-50 px-2 rounded-md transition">
            <div className="shrink-0 mt-1 h-3 w-3 bg-indigo-500 rounded-full"></div>
            <p className="text-sm text-slate-700">Hello! How can I help you?</p>
          </li>

          <li className="py-4 flex items-start gap-3 hover:bg-slate-50 px-2 rounded-md transition">
            <div className="shrink-0 mt-1 h-3 w-3 bg-green-500 rounded-full"></div>
            <p className="text-sm text-slate-700">Your order has been shipped.</p>
          </li>

          <li className="py-4 flex items-start gap-3 hover:bg-slate-50 px-2 rounded-md transition">
            <div className="shrink-0 mt-1 h-3 w-3 bg-orange-500 rounded-full"></div>
            <p className="text-sm text-slate-700">Do not forget to check our new arrivals!</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
