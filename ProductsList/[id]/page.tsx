// app/products/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Package } from "lucide-react";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  // Hide unpublished products + 404 for missing
  if (!product || !product.published) notFound();

  // Convert price from cents → dollars
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  // Build full name safely
  const getSellerName = () => {
    if (!product.user) return "Unknown Artisan";
    const fullName = `${product.user.firstName} ${product.user.lastName}`.trim();
    return fullName || product.user.email.split("@")[0];
  };

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-8 font-medium transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Marketplace
        </Link>

        {/* Product Card */}
        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Image */}
          <div className="relative aspect-square bg-amber-50">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-32 w-32 text-amber-200" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-10 flex flex-col justify-between">
            <div>
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6 leading-tight">
                {product.title}
              </h1>

              {/* Price */}
              <p className="text-6xl font-bold text-amber-600 mb-8">
                {formatPrice(product.price)}
              </p>

              {/* Category Badge */}
              {product.category && (
                <div className="mb-8">
                  <span className="inline-block bg-amber-100 text-amber-800 px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
                    {product.category.replace("_", " ")}
                  </span>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Seller & Date */}
              <div className="space-y-6 text-gray-700 border-t pt-6">
                <div className="flex items-center gap-4">
                  <User className="h-6 w-6 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-500">Handcrafted by</p>
                    <p className="font-semibold text-lg">{getSellerName()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Calendar className="h-6 w-6 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-500">Listed on</p>
                    <p className="font-medium">
                      {new Date(product.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12">
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xl py-6 rounded-2xl transition-all shadow-xl transform hover:scale-[1.02]">
                Contact Artisan
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Interested? Reach out directly to the creator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}