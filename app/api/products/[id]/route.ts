// app/api/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Works perfectly on all Zod versions (including yours)
const updateProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).trim(),
  price: z.number().int().positive("Price must be a positive number (in cents)"),
  description: z.string().min(1, "Description is required").trim(),
  images: z.array(z.string().url("Each image must be a valid URL")).default([]),
  category: z.enum(["METALWORK", "TEXTILE", "WOODWORK"], {
    message: "Category is required and must be one of: METALWORK, TEXTILE, WOODWORK",
  }),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Next.js 14+ requirement

  // ───── Authentication ─────
  const session = await auth();
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // ───── Ownership check ─────
  const product = await prisma.product.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!product) {
    return new NextResponse("Product not found", { status: 404 });
  }

  if (product.userId !== currentUser.id) {
    return new NextResponse("Forbidden: You can only edit your own products", {
      status: 403,
    });
  }

  // ───── Parse & validate body ─────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const result = updateProductSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: result.error.format(),
      },
      { status: 400 }
    );
  }

  const { title, price, description, images, category } = result.data;

  // ───── Update product ─────
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        price,
        description,
        images,
        category,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Product update failed:", error);
    return new NextResponse("Failed to update product", { status: 500 });
  }
}