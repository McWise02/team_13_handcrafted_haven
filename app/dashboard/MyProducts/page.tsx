// app/dashboard/MyProducts/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Edit, Plus } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Server Action — safe and secure
async function deleteProduct(id: string) {
  "use server";

  const session = await auth();
  if (!session?.user?.email) return;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return;

  // Security: only allow deleting own products
  const product = await prisma.product.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!product || product.userId !== user.id) {
    console.error("Unauthorized delete attempt");
    return;
  }

  await prisma.product.delete({ where: { id } });

  // Optional: refresh the page data
  revalidatePath("/dashboard/MyProducts");
}

export const revalidate = 0;

export default async function MyProductsPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findFirst({
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            My Products ({products.length})
          </h1>
          <Link
            href="/dashboard/MyProducts/new"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-xl shadow">
            <p className="text-xl text-gray-600 mb-6">No products listed yet</p>
            <Link
              href="/dashboard/MyProducts/new"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg text-lg transition"
            >
              List Your First Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-square relative bg-gray-100">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-2xl font-bold text-amber-600 mb-6">
                    ${(product.price / 100).toFixed(2)}
                  </p>

                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard/MyProducts/edit/${product.id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 py-2.5 rounded text-center text-sm font-medium transition flex items-center justify-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>

                    {/* SAFE DELETE — NO onClick, NO onSubmit, NO event handlers */}
                    <form action={deleteProduct.bind(null, product.id)} className="flex-1">
                      <button
                        type="submit"
                        className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-2.5 rounded text-sm font-medium transition flex items-center justify-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
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