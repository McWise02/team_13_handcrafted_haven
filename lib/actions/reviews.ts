"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "../generated/prisma";
import { getCurrentUser } from "@/lib/get-current-user";
import { revalidatePath } from "next/cache";

export async function createReview(formData: FormData) {
  const user = await getCurrentUser();

  const productId = formData.get("productId") as string | null;
  const ratingRaw = formData.get("rating") as string | null;
  const commentRaw = formData.get("comment") as string | null;
  const firstName = formData.get("firstName") as string | null;
  const email = formData.get("email") as string | null;

  if (!productId) {
    throw new Error("Missing productId");
  }

  if (!ratingRaw) {
    throw new Error("Missing rating");
  }

  const rating = Number(ratingRaw);
  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be a number between 1 and 5");
  }

  // Base review data
  let reviewData: Prisma.ReviewCreateInput = {
    rating,
    comment: commentRaw?.trim() || null,
    product: {
      connect: { id: productId },
    },
  };

  if (user && user.id) {
    // Logged-in user → connect to User
    reviewData = {
      ...reviewData,
      user: {
        connect: { id: user.id },
      },
    };
  } else {
    // Guest → require firstName + email
    if (!firstName || !email) {
      throw new Error("First name and email are required to leave a review.");
    }

    reviewData = {
      ...reviewData,
      firstName: firstName.trim(),
      email: email.trim(),
    };
  }

  const review = await prisma.review.create({
    data: reviewData,
    include: {
      user: true,    // so you get user info when present
      product: true, // optional
    },
  });

  // Revalidate the product page so the new review shows up
  revalidatePath(`/browse/product/view/${productId}`);

  return review;
}
