//'use server'
import React from "react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";

//export const dynamic = "force-dynamic";
export const revalidate = 60;

type PageProps = {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 6;


export default async function CustomerBrowsePage(props: PageProps) {
    const searchParams = await props.searchParams;
  const page = Number(searchParams?.page || 1);

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      include: { user: true, _count: { select: { reviews: true } } },
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-6 h-6 text-indigo-600" />
        <h1 className="text-3xl font-bold">Newly Created Products</h1>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="p-10 bg-white border rounded-xl text-center shadow">
          <p className="text-gray-600">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-gray-100">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={`${product.title} by ${product.user.firstName} ${product.user.lastName}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2">
                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900">
                  {product.title}
                </h2>

                {/* Category */}
                <p className="text-xs text-gray-600">
                  Category: <span className="font-medium">{product.category}</span>
                </p>

                {/* Price */}
                <p className="text-indigo-600 font-bold text-base">
                  ${product.price}
                </p>

                {/* Artisan */}
                <p className="text-sm text-gray-700">
                  By{" "}
                  <span className="font-semibold">
                    {product.user.firstName} {product.user.lastName}
                  </span>
                </p>

                {/* Craft Story */}
                {product.craftStory && (
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {product.craftStory}
                  </p>
                )}

                {/* Reviews */}
                <p className="text-xs text-gray-500">
                  {product._count.reviews} reviews
                </p>

                {/* View button */}
                <Link
                  href={`/dashboard/products/${product.id}`}
                  className="mt-3 block bg-black text-white text-center px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
          {/* Previous */}
          <Link
            href={page > 1 ? `?page=${page - 1}` : "#"}
            className={`px-4 py-2 border rounded-lg ${
              page <= 1
                ? "opacity-40 pointer-events-none"
                : "hover:bg-gray-100"
            }`}
          >
            Previous
          </Link>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <Link
              key={num}
              href={`?page=${num}`}
              className={`px-3 py-1 border rounded-lg ${
                num === page
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {num}
            </Link>
          ))}

          {/* Next */}
          <Link
            href={page < totalPages ? `?page=${page + 1}` : "#"}
            className={`px-4 py-2 border rounded-lg ${
              page >= totalPages
                ? "opacity-40 pointer-events-none"
                : "hover:bg-gray-100"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
