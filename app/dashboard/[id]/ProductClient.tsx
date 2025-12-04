// app/dashboard/[id]/ProductClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Clock, ShoppingBag, ScrollText, X } from "lucide-react";
import { useState } from "react";

export function ProductClient({
  product,
  sellerName,
  craftStory,
}: {
  product: any;
  sellerName: string;
  craftStory: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  const mainImage = product.images?.[0];
  const otherImages = product.images?.slice(1) ?? [];

  return (
    <>
      <div className="min Jupiter-h-screen bg-amber-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-8 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-square relative bg-amber-50">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-amber-200 border-2 border-dashed border-amber-400 rounded-xl w-64 h-64" />
                  </div>
                )}
              </div>

              {otherImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3 p-6 bg-gradient-to-t from-amber-50 to-transparent">
                  {otherImages.map((img: string, i: number) => (
                    <div
                      key={i}
                      className="aspect-square relative rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 shadow-md"
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
                <h1 className="text-4xl lg:text-5xl font-bold text-amber-900 mb-6 leading-tight">
                  {product.title}
                </h1>

                <div className="text-5xl lg:text-6xl font-bold text-amber-600 mb-10 tracking-tight">
                  {formatPrice(product.price)}
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group mb-10 inline-flex items-center gap-4 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-lg py-5 px-10 rounded-2xl transition-all shadow-lg hover:shadow-xl"
                >
                  <ScrollText className="h-7 w-7 group-hover:rotate-3 transition-transform" />
                  Read the Artisan&apos;s Craft Story
                  <span className="text-amber-600 ml-2">→</span>
                </button>

                <div className="space-y-8 text-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-full">
                      <User className="h-7 w-7 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm text-amber-600 font-medium">Handcrafted by</p>
                      <p className="text-2xl font-bold text-amber-900">{sellerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-full">
                      <Clock className="h-7 w-7 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm text-amber-600 font-medium">Listed on</p>
                      <p className="text-lg font-semibold">
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
                <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xl lg:text-2xl py-7 rounded-2xl transition-all flex items-center justify-center gap-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  <ShoppingBag className="h-8 w-8" />
                  Contact Seller to Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Craft Story Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 p-10 text-white relative overflow-hidden">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all"
              >
                <X className="w-7 h-7" />
              </button>

              <div className="flex items-center gap-4 mb-3">
                <ScrollText className="h-12 w-12" />
                <h2 className="text-4xl font-bold">The Craft Story</h2>
              </div>
              <p className="text-xl text-amber-100 opacity-90">
                The soul behind &ldquo;{product.title}&rdquo;
              </p>
            </div>

            {/* Body */}
            <div className="p-10 bg-amber-50/80 overflow-y-auto max-h-[60vh]">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center shadow-inner">
                  <User className="h-12 w-12 text-amber-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-700">Created with love by</p>
                  <p className="text-3xl font-bold text-amber-900">{sellerName}</p>
                </div>
              </div>

              <div className="prose prose-lg prose-amber max-w-none text-gray-800 leading-loose">
                {craftStory.split("\n\n").map((paragraph: string, i: number) => (
                  <p key={i} className={i > 0 ? "mt-6" : ""}>
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}