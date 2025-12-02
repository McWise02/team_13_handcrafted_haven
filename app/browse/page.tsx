'use server'

import Search from "@/app/ui/browse/BrowseSearch";
import Pagination from "@/app/ui/browse/Pagination";
import { getTotalBrowsePages, getBrowseProducts } from "@/lib/data/products";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, User, Clock } from "lucide-react";

type BrowsePageProps = {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
};

export default async function CustomerBrowsePage(props: BrowsePageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query?.trim() || "";
  const currentPage = Math.max(1, Number(searchParams?.page) || 1);

  const totalPages = await getTotalBrowsePages(query);

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-4">
            Handcrafted Haven
          </h1>
          <p className="text-xl text-amber-700">
            Discover unique handmade treasures
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <Search placeholder="Search for Products..." />
        </div>

        {/* Product Grid – streamed with skeleton */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid query={query} currentPage={currentPage} />
        </Suspense>

        {/* Pagination */}
        <div className="mt-16 flex justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}

// Product Grid – fetches and displays products
async function ProductGrid({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const products = await getBrowseProducts({ query, page: currentPage });

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const getSellerName = (user: any) =>
    user
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email.split("@")[0]
      : "Artisan";

  if (products.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl shadow-xl">
        <ShoppingBag className="h-24 w-24 text-amber-200 mx-auto mb-6" />
        <p className="text-2xl text-gray-700">
          {query
            ? `No results found for "${query}"`
            : "No items yet. Check back soon!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        // Public product detail page
        <Link
          key={product.id}
          href={`/browse/product/view/${product.id}`}
          className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
        >
          <div className="aspect-square relative bg-amber-50">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="bg-amber-100 border-2 border-dashed border-amber-300 rounded-xl w-32 h-32" />
              </div>
            )}
            <div className="absolute top-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
              {formatPrice(product.price)}
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-amber-700">
              {product.title}
            </h3>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{getSellerName(product.user)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Skeleton loader
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-gray-200" />
          <div className="p-6 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-4/5" />
            <div className="h-4 bg-gray-200 rounded w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}