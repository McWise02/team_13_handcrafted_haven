// app/products/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Clock, User } from "lucide-react";

export const revalidate = 60;
export const metadata = { title: "Handcrafted Haven – Marketplace" };

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const getSellerName = (user: any) =>
    user ? `${user.firstName} ${user.lastName}`.trim() || user.email.split("@")[0] : "Artisan";

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-4">
            Handcrafted Haven
          </h1>
          <p className="text-xl text-amber-700">
            {products.length} handmade {products.length === 1 ? "item" : "items"} available
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-xl">
            <ShoppingBag className="h-24 w-24 text-amber-200 mx-auto mb-6" />
            <p className="text-2xl text-gray-700">No items yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="aspect-square relative bg-amber-50">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      sizes="25vw"
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
                      <span>{new Date(product.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}