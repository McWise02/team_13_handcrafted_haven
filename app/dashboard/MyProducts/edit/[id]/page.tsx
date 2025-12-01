// app/dashboard/MyProducts/edit/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import ProductForm from "@/components/ProductForm";

// CRITICAL: You MUST await params in Next.js 16 with Turbopack
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>; // ← This is now a Promise!
}) {
  // UNWRAP the params Promise first
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Get current user ID
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!currentUser) {
    redirect("/login");
  }

  // Build where condition separately (fixes Turbopack source map bug)
  const whereCondition = {
    id,
    userId: currentUser.id,
  };

  const product = await prisma.product.findFirst({
    where: whereCondition,
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      category: true,
      images: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Edit Product</h1>
        <ProductForm product={product} />
      </div>
    </div>
  );
}