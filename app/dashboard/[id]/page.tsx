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
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
    },
  });

  if (!product) return notFound();

  const sellerName =
    product.user
      ? `${product.user.firstName || ""} ${product.user.lastName || ""}`.trim() ||
        product.user.email.split("@")[0]
      : "Artisan";

  const craftStory =
    product.description && product.description.trim().length > 80
      ? product.description.trim()
      : `This ${product.title.toLowerCase()} was born in quiet moments of deep focus and care...\n\n(beautiful fallback story here)`;

  return (
    <ProductClient
      product={product}
      sellerName={sellerName}
      craftStory={craftStory}
    />
  );
}