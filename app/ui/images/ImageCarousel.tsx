"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
interface ImageCarouselProps {
  images: string[];
  altBase?: string; // optional base alt text
}

export default function ImageCarousel({ images, altBase = "Product image" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-md bg-gray-100 text-sm text-gray-500">
        No images available
      </div>
    );
  }

  const total = images.length;

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Image container */}
      <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-80 bg-gray-100">
        <Image
          src={images[currentIndex]}
          alt={`${altBase} ${currentIndex + 1}`}
          fill={true}
          className="object-cover"
        />
      </div>

      {/* Previous button */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
          >
            {/* If you don't use lucide-react, replace with plain text: {"<"} */}
            <ArrowLeftIcon/>
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
          >
          <ArrowRightIcon/>

          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="mt-2 flex justify-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 w-2 rounded-full ${
                idx === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
