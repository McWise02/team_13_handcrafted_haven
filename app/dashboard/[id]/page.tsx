// app/dashboard/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductClient } from "./ProductClient";

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      price: true,
      description: true,
      craftStory: true,
      createdAt: true,
      images: true,                    // ← This is allowed because it's a scalar field
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      // reviews optional if you want them later
      // reviews: { ... }
    },
  });

  if (!product) notFound();

  const sellerName = product.user
    ? `${product.user.firstName || ""} ${product.user.lastName || ""}`.trim() ||
      product.user.email.split("@")[0]
    : "Unknown Artisan";

  const craftStory = product.craftStory?.trim()
    ? product.craftStory.trim()
    : product.description?.trim() && product.description.trim().length > 80
      ? product.description.trim()
      : `This artisan has not provided a craft story for this product.`;

  return (
    <ProductClient
      product={product}           // ← product.images is already string[]
      sellerName={sellerName}
      craftStory={craftStory}
    />
  );
}