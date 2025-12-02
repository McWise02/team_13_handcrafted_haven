// app/browse/product/view/[id]/page.tsx

import { getProductForViewing } from "@/lib/data/products";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShoppingBag, User, Clock } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductViewPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductForViewing(id);

  if (!product) {
    notFound();
  }

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const sellerName = product.user
    ? `${product.user.firstName} ${product.user.lastName}`.trim() || product.user.email.split("@")[0]
    : "Artisan";

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {product.images[0] ? (
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square bg-amber-100 border-2 border-dashed border-amber-300 rounded-2xl" />
            )}
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-amber-900">{product.title}</h1>
              <p className="text-3xl font-bold text-amber-600 mt-4">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="prose prose-amber max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{sellerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <button className="w-full bg-amber-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-amber-700 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}