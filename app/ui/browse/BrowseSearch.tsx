"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type ProductCategory = "METALWORK" | "TEXTILE" | "WOODWORK";

const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "METALWORK", label: "Metalwork" },
  { value: "TEXTILE", label: "Textile" },
  { value: "WOODWORK", label: "Woodwork" },
];

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [query, setQuery] = useState<string>(
    searchParams.get("query")?.toString() ?? ""
  );
  const [categories, setCategories] = useState<ProductCategory[]>(() => {
    const fromUrl = searchParams.getAll("categories") as ProductCategory[];
    return fromUrl ?? [];
  });

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    // whenever we change the search, reset page to 1 if you use pagination
    params.set("page", "1");

    replace(`${pathname}?${params.toString()}`);
  }

function handleCategoryToggle(category: ProductCategory) {
  // categories here is the current state value from useState
  const exists = categories.includes(category);
  const next = exists
    ? categories.filter((c) => c !== category)
    : [...categories, category];

  // 1) update state
  setCategories(next);

  // 2) update URL (side effect) – outside of setState
  const params = new URLSearchParams(searchParams);

  // remove all existing categories from URL and then add the current selection
  params.delete("categories");
  next.forEach((cat) => params.append("categories", cat));

  // reset page when filters change
  params.set("page", "1");

  replace(`${pathname}?${params.toString()}`);
}
  // debounce query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // keep local state in sync when user navigates via back/forward, etc.
  useEffect(() => {
    setQuery(searchParams.get("query")?.toString() ?? "");
    setCategories(searchParams.getAll("categories") as ProductCategory[]);
  }, [searchParams]);

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Search input */}
      <div className="relative flex flex-1 shrink-0">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          id="search"
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {PRODUCT_CATEGORIES.map((cat) => {
          const isActive = categories.includes(cat.value);
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => handleCategoryToggle(cat.value)}
              className={
                "rounded-full border px-3 py-1 text-xs font-medium transition " +
                (isActive
                  ? "border-sky-600 bg-sky-50 text-sky-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-sky-400 hover:text-sky-700")
              }
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
