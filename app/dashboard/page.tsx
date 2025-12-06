// app/products/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Clock, User } from "lucide-react";
import Pagination from "../ui/products/Pagination";
import { Suspense } from "react";

export const revalidate = 60;
export const metadata = { title: "Handcrafted Haven – Marketplace" };

const PAGE_SIZE = 8;

export default async function ProductsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const params = await searchParams;
  const currentPage = Number(params?.page || "1") || 1;
  const totalItems = await prisma.product.count();
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
    },
    take: PAGE_SIZE,
    skip: (currentPage - 1) * PAGE_SIZE,
  });

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const getSellerName = (user: any) =>
    user ? `${user.firstName} ${user.lastName}`.trim() || user.email.split("@")[0] : "Artisan";

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-4">
            Handcrafted Haven
          </h1>
          <p className="text-xl text-blue-700">
            {products.length} handmade {products.length === 1 ? "item" : "items"} available
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-xl border border-blue-100">
            <ShoppingBag className="h-24 w-24 text-blue-200 mx-auto mb-6" />
            <p className="text-2xl text-gray-700">No items yet. Check back soon!</p>
            <p className="text-blue-600 mt-4">Be the first to list your creation →</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/dashboard/${product.id}`}
                  className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-blue-100 hover:border-blue-200"
                >
                  <div className="aspect-square relative bg-blue-50">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        sizes="25vw"
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="bg-blue-100 border-2 border-dashed border-blue-300 rounded-xl w-32 h-32" />
                      </div>
                    )}
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      {formatPrice(product.price)}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 group-hover:text-blue-700 transition">
                      {product.title}
                    </h3>
                    
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        <span>{getSellerName(product.user)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{new Date(product.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </div>
    </div>
  );
}