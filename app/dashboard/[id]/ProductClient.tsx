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

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const otherImages = product.images.slice(1);

  return (
    <>
      {/* Your entire UI from before goes here */}
      <div className="min-h-screen bg-amber-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-8 font-medium">
            <ArrowLeft className="h-5 w-5" /> Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Image section */}
            <div className="relative">
              <div className="aspect-square relative bg-amber-50">
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
                ) : (
                  <div className="flex items-center justify-center h-full bg-amber-100">
                    <div className="bg-amber-200 border-2 border-dashed border-amber-400 rounded-xl w-48 h-48" />
                  </div>
                )}
              </div>
              {otherImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50">
                  {otherImages.map((img: string, i: number) => (
                    <div key={i} className="aspect-square relative rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition">
                      <Image src={img} alt="" fill sizes="10vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info section */}
            <div className="flex flex-col justify-between p-8 lg:p-12">
              <div>
                <h1 className="text-4xl font-bold text-amber-900 mb-6">{product.title}</h1>
                <div className="text-5xl font-bold text-amber-600 mb-8">{formatPrice(product.price)}</div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mb-10 inline-flex items-center gap-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold py-4 px-8 rounded-2xl transition shadow-md"
                >
                  <ScrollText className="h-6 w-6" />
                  Read the Artisan&apos;s Craft Story
                </button>

                {/* Rest of your info (seller, date, etc.) */}
                <div className="space-y-6 text-gray-600">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="text-sm text-gray-500">Handmade by</p>
                      <p className="font-semibold text-lg text-gray-800">{sellerName}</p>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-8 text-white">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full">
                <X className="w-7 h-7" />
              </button>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <ScrollText className="h-8 w-8" /> The Craft Story
              </h2>
              <p className="text-amber-100 text-lg mt-2 opacity-90">Behind "{product.title}"</p>
            </div>
            <div className="p-8 bg-amber-50 overflow-y-auto max-h-[60vh]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-amber-200 border-2 border-dashed border-amber-400 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-amber-600 font-medium">Handcrafted by</p>
                  <p className="text-2xl font-bold text-amber-900">{sellerName}</p>
                </div>
              </div>
              <div className="prose prose-amber text-gray-700 text-lg leading-relaxed">
                {craftStory.split("\n\n").map((p: string, i: number) => (
                  <p key={i} className="mb-5">{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}