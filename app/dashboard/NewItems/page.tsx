import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Tag, Package } from "lucide-react";

export const revalidate = 60;

const PAGE_SIZE = 6;

export default async function ProductsPage({ searchParams }) {
  // Read page number from URL
  const page = Number(searchParams?.page) || 1;
  const offset = (page - 1) * PAGE_SIZE;

  // Query products
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      skip: offset,
      take: PAGE_SIZE,
      include: {
        user: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" }, // newest first
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-7 h-7 text-indigo-600" />
          New Products
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Newly added handmade products by talented artisans.
        </p>
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="p-10 bg-white border rounded-xl text-center shadow">
          <p className="text-slate-600 text-sm">No products found.</p>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            {/* Product Image */}
            <div className="relative w-full h-48 bg-slate-100">
              {product.images?.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  No Image
                </div>
              )}
            </div>

            <div className="p-5 space-y-3">
              {/* Title */}
              <h2 className="text-lg font-semibold text-slate-900">
                {product.title}
              </h2>

              {/* Category */}
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-700">
                <Tag className="w-3 h-3" />
                {product.category}
              </span>

              {/* Price */}
              <p className="text-indigo-600 font-semibold text-base">
                ${product.price}
              </p>

              {/* Artisan */}
              <p className="text-xs text-slate-600">
                By{" "}
                <span className="font-medium text-slate-800">
                  {product.user.firstName} {product.user.lastName}
                </span>
              </p>

              {/* Craft Story Snippet */}
              {product.craftStory && (
                <p className="text-sm text-slate-700 line-clamp-2">
                  {product.craftStory}
                </p>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-xs text-slate-500">
                  {product._count.reviews} reviews
                </span>

                <Link
                  href={`/dashboard/products/${product.id}`}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  View →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-10">
        {/* Previous */}
        <Link
          href={`?page=${page - 1}`}
          className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-sm ${
            page <= 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>

        <span className="text-sm text-slate-700">
          Page {page} of {totalPages}
        </span>

        {/* Next */}
        <Link
          href={`?page=${page + 1}`}
          className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-sm ${
            page >= totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-slate-50"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
