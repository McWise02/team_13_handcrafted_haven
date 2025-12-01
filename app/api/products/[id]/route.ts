// app/api/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// This works on **every** version of Zod (3.18 → 3.24+)
const updateProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).trim(),
  price: z.number().int().positive("Price must be greater than 0"),
  description: z.string().min(1, "Description is required").trim(),
  images: z.array(z.string().url("Invalid image URL")).default([]),

  // This syntax is universally supported — no more TS 2769
  category: z.enum(["METALWORK", "TEXTILE", "WOODWORK"], {
    message: "Category is required and must be one of: METALWORK, TEXTILE, WOODWORK",
  }),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Next.js 14+ requirement
) {
  const { id } = await params; // must await!

  // ───── Auth ─────
  const session = await auth();
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true },
  });

  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // ───── Ownership ─────
  const product = await prisma.product.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!product) {
    return new NextResponse("Product not found", { status: 404 });
  }

  if (product.userId !== currentUser.id) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // ───── Validate body ─────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const { title, price, description, images, category } = parsed.data;

  // ───── Update ─────
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        price,
        description, // required in your DB → always string
        images,
        category,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Product update failed:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}