// components/ProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id?: string;
  title: string;
  price: number;
  images?: string[];
  description?: string;
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
      title: formData.get("title") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      images: images.length > 0 ? images : null,
    };

    const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PUT" : "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/dashboard/MyProducts");
      router.refresh();
    } else {
      alert("Failed to save product");
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-xl bg-white p-8 shadow">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          name="title"
          defaultValue={product?.title}
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Price ($)</label>
        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price}
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description (optional)</label>
        <textarea
          name="description"
          defaultValue={product?.description || ""}
          rows={4}
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Image URL (one for now)</label>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={images[0] || ""}
          onChange={(e) => setImages(e.target.value ? [e.target.value] : [])}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-amber-600 px-6 py-3 text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}