"use client";

import { useState } from "react";

interface ReviewUser {
  firstName: string;
  lastName?: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string | Date;

  user?: ReviewUser | null;

  firstName?: string | null;
  email?: string | null;
}

interface ReviewsCarouselProps {
  reviews: Review[];
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex w-full items-center justify-center rounded-md bg-gray-100 p-4 text-sm text-gray-500">
        Not a Review Yet
      </div>
    );
  }

  const total = reviews.length;
  const current = reviews[currentIndex];

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const formattedDate = new Date(current.createdAt).toLocaleDateString();

  const renderStars = (rating: number) => {
    const max = 5;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={i < rating ? "text-yellow-500" : "text-gray-300"}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-xs text-gray-500">({rating}/5)</span>
      </div>
    );
  };

  // Determine display name + email based on whether it's a user or guest
  const isFromUser = !!current.user;

  const displayName = isFromUser
    ? `${current.user!.firstName}${
        current.user!.lastName ? ` ${current.user!.lastName}` : ""
      }`
    : current.firstName || "Anonymous";

  const guestEmail = !isFromUser ? current.email : null;

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-lg border bg-white p-4 shadow-sm">
      {/* Review content */}
      <div className="space-y-2">
        {renderStars(current.rating)}

        {current.comment && (
          <p className="text-sm text-gray-800 leading-relaxed">
            “{current.comment}”
          </p>
        )}

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex flex-col">
            <span>{displayName}</span>
            {guestEmail && (
              <span className="text-[10px] text-gray-400">{guestEmail}</span>
            )}
          </div>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Prev / Next buttons */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 px-2 py-1 text-sm shadow hover:bg-white"
          >
            {"<"}
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 px-2 py-1 text-sm shadow hover:bg-white"
          >
            {">"}
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 w-2 rounded-full ${
                idx === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
