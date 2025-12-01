// app/api/products/[id]/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Check if product exists and belongs to user
  const existingProduct = await prisma.product.findUnique({
    where: { id: params.id },
    select: { userId: true },
  });

  if (!existingProduct) {
    return new Response("Product not found", { status: 404 });
  }

  if (existingProduct.userId !== user.id) {
    return new Response("Forbidden: You can only edit your own products", { status: 403 });
  }

  try {
    const { title, price, description, images, category } = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        title: title.trim(),
        price, // already in cents (int)
        description: description?.trim() || null,
        images: images ?? [], // always array
        category,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return new Response("Invalid data or server error", { status: 400 });
  }
}