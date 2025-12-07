// app/ui/products/ContactSellerButton.tsx
"use client";

import { useState } from "react";

type ContactSellerButtonProps = {
  firstName: string;
  email: string;
  title?: string;
};

export default function ContactSellerButton({
  firstName,
  email,
  title,
}: ContactSellerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Contact Seller
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">
                Contact Seller
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                aria-label="Close modal"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Seller Info */}
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-600">Seller Name</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {firstName}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600">Email Address</p>
                <p className="mt-1 font-mono text-base text-blue-600 break-all">
                  {email}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent(
                    `Inquiry about your product: "${title || "Your Item"}"`
                  )}&body=${encodeURIComponent(
                    `Hi ${firstName},\n\nI'm interested in your product "${
                      title || "your item"
                    }".\n\n[Your message here]\n\nBest regards,\n`
                  )}`}
                  className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Open Email App
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(email);
                    alert("Email copied to clipboard!");
                  }}
                  className="text-sm text-slate-600 hover:text-slate-800 underline transition"
                >
                  Copy email to clipboard
                </button>
              </div>

              <p className="text-center text-xs text-slate-500 mt-4">
                Your email client will open with a pre-filled message
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}