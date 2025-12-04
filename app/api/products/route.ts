// app/api/products/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export type ProductCategory = "METALWORK" | "TEXTILE" | "WOODWORK";

type CreateProductBody = {
  title: string;
  price: number; // already in cents (from frontend)
  description?: string | null;
  craftStory?: string | null;
  images?: string[];
  category: ProductCategory;
};

// POST → Create a new product
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  let body: CreateProductBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, price, description, craftStory, images, category } = body;

  if (!title || !price || !category) {
    return NextResponse.json(
      { error: "Missing required fields: title, price, or category" },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        price: Number(price), // already in cents
        description: description?.trim(),
        craftStory: craftStory?.trim() || null,
        images: images?.length ? images : [],
        category,
        userId: user.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// GET → List all products for the current user (for MyProducts page)
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      title: true,
      price: true,
      description: true,
      craftStory: true,
      images: true,
      category: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}