// app/dashboard/[id]/page.tsx   (or wherever your product detail page is)
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductClient } from "./ProductClient";

export const revalidate = 60;

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: product ? `${product.title} – Handcrafted Haven` : "Product Not Found",
  };
};

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
      images: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!product) notFound();

  const sellerName = product.user
    ? `${product.user.firstName || ""} ${product.user.lastName || ""}`.trim() ||
      product.user.email.split("@")[0]
    : "Unknown Artisan";

  const craftStory = product.craftStory?.trim()
    ? product.craftStory.trim()
    : product.description?.trim() && product.description.trim().length > 100
      ? product.description.trim()
      : "No craft story provided.";

  // Format price and date without date-fns
  const formattedPrice = `$${((product.price || 0) / 100).toFixed(2)}`;
  
  const formattedDate = new Date(product.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <ProductClient
      product={{
        ...product,
        formattedPrice,
        formattedDate,
      }}
      sellerName={sellerName}
      craftStory={craftStory}
    />
  );
}