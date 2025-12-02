'use server'

import { prisma } from "../prisma"
import { unstable_cache } from "next/cache";

const PRODUCTS_PER_PAGE = 15;

// Helper – we type it as `any` so TS stops complaining about Prisma namespace
const searchWhere = (query: string): any => ({
  OR: [
    { title: { contains: query, mode: "insensitive" as const } },
    { description: { contains: query, mode: "insensitive" as const } },
  ],
});

// 1. Browse products with search + pagination
export async function getBrowseProducts({
  query = "",
  page = 1,
}: {
  query?: string;
  page?: number;
} = {}) {
  const skip = (page - 1) * PRODUCTS_PER_PAGE;

  const where = query ? searchWhere(query) : {};

  return await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
    },
    take: PRODUCTS_PER_PAGE,
    skip,
  });
}

// 2. Total pages (respects search query)
export async function getTotalBrowsePages(query: string = ""): Promise<number> {
  const where = query ? searchWhere(query) : {};

  const count = await prisma.product.count({ where });
  return Math.max(1, Math.ceil(count / PRODUCTS_PER_PAGE));
}

// 3. Cached first page (optional – feel free to keep)
export const getCachedInitialProducts = unstable_cache(
  async () => {
    return await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      take: PRODUCTS_PER_PAGE,
    });
  },
  ["browse-initial-products"],
  { revalidate: 60 }
);

// 4. Single product page
export async function getProductForViewing(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
}