// app/dashboard/MyProducts/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Edit, Plus } from "lucide-react";

// CORRECT NextAuth v5 import (2025)
import { auth } from "@/auth";

export const revalidate = 0;

export default async function MyProductsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">
          Please <Link href="/login" className="text-amber-600 underline">log in</Link> to view your products
        </p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return <div className="text-center py-20">User not found</div>;
  }

  const products = user.products || [];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            My Products ({products.length})
          </h1>
          <Link
            href="/dashboard/MyProducts/new"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-xl shadow">
            <p className="text-xl text-gray-600 mb-6">No products listed yet</p>
            <Link href="/dashboard/MyProducts/new" className="bg-amber-600 text-white px-8 py-4 rounded-lg text-lg">
              List Your First Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="aspect-square relative bg-gray-100">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No image</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2">{product.title}</h3>
                  <p className="text-2xl font-bold text-amber-600 mb-6">
                    ${Number(product.price).toFixed(2)}
                  </p>
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard/MyProducts/edit/${product.id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 py-2.5 rounded text-center text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <form action={async () => {
                      "use server";
                      await prisma.product.delete({ where: { id: product.id } });
                    }}>
                      <button
                        type="submit"
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2.5 rounded text-sm font-medium"
                        onClick={(e) => !confirm("Delete forever?") && e.preventDefault()}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}