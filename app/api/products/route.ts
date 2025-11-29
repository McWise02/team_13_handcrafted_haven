import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const { title, price, description, images } = await req.json();

  const product = await prisma.product.create({
    data: {
      title,
      price,
      description,
      images,
      user: { connect: { email: session.user.email } },
    },
  });

  return NextResponse.json(product);
}