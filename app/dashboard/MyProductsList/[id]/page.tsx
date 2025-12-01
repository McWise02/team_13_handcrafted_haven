// app/dashboard/MyProductsList/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Clock, ShoppingBag } from "lucide-react";

export const revalidate = 60;

// This is the only correct way in Next.js 16 + Turbopack
export default async function ProductDetailPage({ params }: {
  params: { id: string };
}) {
  // You MUST await params first
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
    },
  });

  if (!product) {
    return notFound();
  }

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const sellerName =
    product.user
      ? `${product.user.firstName || ""} ${product.user.lastName || ""}`.trim() ||
        product.user.email.split("@")[0]
      : "Artisan";

  const otherImages = product.images.slice(1);

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Link
          href="/dashboard/MyProductsList"
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-8 font-medium transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to My Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Main Image */}
          <div className="relative">
            <div className="aspect-square relative bg-amber-50">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-amber-100">
                  <div className="bg-amber-200 border-2 border-dashed border-amber-400 rounded-xl w-48 h-48" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50">
                {otherImages.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square relative rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                  >
                    <Image
                      src={img}
                      alt={`${product.title} - view ${i + 2}`}
                      fill
                      sizes="10vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between p-8 lg:p-12">
            <div>
              <h1 className="text-4xl font-bold text-amber-900 mb-6">
                {product.title}
              </h1>

              <div className="text-5xl font-bold text-amber-600 mb-8">
                {formatPrice(product.price)}
              </div>

              {product.description && (
                <div className="prose prose-amber max-w-none mb-10 text-gray-700">
                  <p className="whitespace-pre-wrap text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="space-y-6 text-gray-600">
                <div className="flex items-center gap-3">
                  <User className="h-6 w-6 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-500">Handmade by</p>
                    <p className="font-semibold text-lg text-gray-800">
                      {sellerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-500">Listed on</p>
                    <p className="font-medium">
                      {new Date(product.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xl py-6 rounded-2xl transition flex items-center justify-center gap-3 shadow-lg">
                <ShoppingBag className="h-7 w-7" />
                Contact Seller to Purchase
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                This is a peer-to-peer marketplace. You'll be connected with the artisan directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}