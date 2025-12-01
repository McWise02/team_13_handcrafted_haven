// app/api/products/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/products → Create a new product
export async function POST(req: Request) {
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

  try {
    const { title, price, description, images, category } = await req.json();

    if (!title || !price || !category) {
      return new Response("Missing required fields", { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        price: Number(price), // stored as integer (cents)
        description: description?.trim() || null,
        images: images ?? [],
        category,
        userId: user.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return new Response("Invalid data or server error", { status: 500 });
  }
}

// GET /api/products → Get all products belonging to the authenticated user
export async function GET() {
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

  const products = await prisma.product.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}