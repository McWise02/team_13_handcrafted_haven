// components/ProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ProductCategory = "METALWORK" | "TEXTILE" | "WOODWORK";

type Product = {
  id?: string;
  title: string;
  price: number; // stored in cents in DB
  description?: string | null;
  images?: string[];
  category: ProductCategory;
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      title: (formData.get("title") as string).trim(),
      price: Math.round(Number(formData.get("price")) * 100), // convert dollars → cents
      description: (formData.get("description") as string)?.trim() || null,
      images: images.length > 0 ? images : [],
      category: formData.get("category") as ProductCategory,
    };

    const url = product ? `/api/products/${product.id}` : "/api/products";
    const method = product ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/dashboard/MyProducts");
        router.refresh();
      } else {
        const error = await res.text();
        alert("Failed to save product: " + error);
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Helper to display price in dollars
  const displayPrice = product?.price !== undefined ? (product.price / 100).toFixed(2) : "";

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-2xl mx-auto">
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          {product ? "Edit Product" : "Create New Product"}
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              defaultValue={product?.title}
              required
              maxLength={100}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-4 py-2 border"
              placeholder="Hand-forged iron candle holder"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              defaultValue={product?.category || ""}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-4 py-2 border"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="METALWORK">Metalwork</option>
              <option value="TEXTILE">Textile</option>
              <option value="WOODWORK">Woodwork</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={displayPrice}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-4 py-2 border"
              placeholder="29.99"
            />
            <p className="text-xs text-gray-500 mt-1">Enter price in dollars (e.g., 29.99)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={5}
              defaultValue={product?.description || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-4 py-2 border"
              placeholder="Tell customers about your handmade piece..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image URL
            </label>
            <input
              type="url"
              value={images[0] || ""}
              onChange={(e) => setImages(e.target.value ? [e.target.value] : [])}
              placeholder="https://example.com/my-product.jpg"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-4 py-2 border"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use a direct link to an image (e.g. from Cloudinary, ImgBB, etc.)
            </p>
            {images[0] && (
              <div className="mt-3">
                <img
                  src={images[0]}
                  alt="Preview"
                  className="h-48 object-cover rounded-lg shadow"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50 transition shadow-md"
          >
            {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}