"use client";

import { User } from "next-auth";
import { useState } from "react";

interface CurrentUser {
  email: string;
  id: string;
  role: string;
}

type FormParams = {
  action: (formData: FormData) => void; // server action
  productId: string;
  user: User | null;
};

export default function CreateReviewForm({ action, productId, user }: FormParams) {
  return (
    <form action={action} className="space-y-3">
      {/* Pass productId to server */}
      <input type="hidden" name="productId" value={productId} />

      {/* Only show these fields if user is logged in */}
      {!user && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="w-full rounded border px-2 py-1 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email to Contact
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded border px-2 py-1 text-sm"
            />
          </div>
        </>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="rating">
          Rating
        </label>
        <select
          id="rating"
          name="rating"
          className="w-full rounded border px-2 py-1 text-sm"
          required
        >
          <option value="">Select rating</option>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Good</option>
          <option value="3">3 - Okay</option>
          <option value="2">2 - Poor</option>
          <option value="1">1 - Terrible</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="comment">
          Comment (optional)
        </label>
        <textarea
          id="comment"
          name="comment"
          className="w-full rounded border px-2 py-1 text-sm"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Submit review
      </button>
    </form>
  );
}
