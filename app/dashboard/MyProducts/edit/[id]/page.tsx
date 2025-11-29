// app/dashboard/MyProducts/edit/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      category: true,
      images: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      // Add the owner's email
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!product || product.user.email !== session.user.email) {
    return <div className="text-center py-20">Product not found or access denied</div>;
  }

  // Pass the product without the nested user (your form probably doesn't expect it)
  const { user, ...productWithoutUser } = product;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">Edit Product</h1>
        <ProductForm product={productWithoutUser} />
      </div>
    </div>
  );
}