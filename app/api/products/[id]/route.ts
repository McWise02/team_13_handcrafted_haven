// app/api/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema – description is required in your DB
const updateProductSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  price: z.number().int().positive(),
  description: z.string().trim().min(1, "Description is required"), // required
  images: z.array(z.string().url()).default([]),
  category: z.enum(["METALWORK", "TEXTILE", "WOODWORK"]),
});

type Params = Promise<{ id: string }>;

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;

  // ───── Auth ─────
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

  // ───── Parse & validate body ─────
  let body;
  try {
    body = await request.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const result = updateProductSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid data", details: result.error.format() },
      { status: 400 }
    );
  }

  const { title, price, description, images, category } = result.data;

  // ───── Update (description is required → always string) ─────
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        price,
        description,        // ← now guaranteed to be non-empty string
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