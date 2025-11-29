import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const { title, price, description, images } = await req.json();

  const product = await prisma.product.update({
    where: { id: params.id },
    data: { title, price, description, images },
  });

  return NextResponse.json(product);
}