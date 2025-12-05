"use client";

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  isLoading = false,
}: PaginationProps) {

  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      params.delete("page");
      router.push(`/dashboard`);
    } else {
      params.set("page", String(page));
      router.push(`/dashboard?${params.toString()}`);
    }
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    const halfWindow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfWindow);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={!canGoPrevious || isLoading}
        className={clsx(
          'p-2 rounded-md transition',
          canGoPrevious && !isLoading
            ? 'hover:opacity-80 cursor-pointer'
            : 'opacity-50 cursor-not-allowed'
        )}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {pageNumbers.map((page, idx) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-2">
              {page}
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={clsx(
                "px-3 py-2 rounded-md font-semibold transition",
                currentPage === page ? "text-white" : "hover:opacity-80"
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={!canGoNext || isLoading}
        className={clsx(
          'p-2 rounded-md transition',
          canGoNext && !isLoading
            ? 'hover:opacity-80 cursor-pointer'
            : 'opacity-50 cursor-not-allowed'
        )}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      <div className="ml-4 text-sm font-semibold">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
