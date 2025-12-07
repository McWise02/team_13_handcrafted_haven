// app/dashboard/MyProducts/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Edit, Plus } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Pagination from "@/app/ui/products/Pagination"

// Server Action — unchanged
async function deleteProduct(id: string) {
  "use server";

  const session = await auth();
  if (!session?.user?.email) return;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!product || product.userId !== user.id) {
    console.error("Unauthorized delete attempt");
    return;
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/dashboard/MyProducts");
}

export const revalidate = 0;
const PRODUCTS_PER_PAGE = 8;

export default async function MyProductsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
    });

  if (!user) {
    return <div className="text-center py-20">User not found</div>;
  }
  const currentPage = Number(searchParams.page) || 1;
  const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({
      where: { userId: user.id },
    }),
  ]);
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
  return (
    <div className="min-h-screen bg-blue-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">
            My Products ({totalCount})
          </h1>
          <Link
            href="/dashboard/MyProducts/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition shadow-md"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </Link>
        </div>

        {totalCount === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-xl border border-blue-100">
            <p className="text-xl text-gray-600 mb-6">No products listed yet</p>
            <Link
              href="/dashboard/MyProducts/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg"
            >
              List Your First Item
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-blue-100"
                >
                  <div className="aspect-square relative bg-blue-50">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-blue-300 text-sm font-medium">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 mb-2">
                      {product.title}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 mb-6">
                      ${(product.price / 100).toFixed(2)}
                    </p>

                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/MyProducts/edit/${product.id}`}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-lg text-center text-sm font-medium transition flex items-center justify-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Link>

                      <form action={deleteProduct.bind(null, product.id)} className="flex-1">
                        <button
                          type="submit"
                          className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1 border border-red-200"
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </div>
    </div>
  );
}