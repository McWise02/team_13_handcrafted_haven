// app/dashboard/MyProducts/edit/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!currentUser) {
    redirect("/login");
  }

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
      craftStory: true,
      price: true,
      category: true,
      images: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-blue-50 py-10">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-8 text-4xl font-bold text-blue-900">
          Edit Product
        </h1>
        <ProductForm product={product} />
      </div>
    </div>
  );
}