'use server'

import { ProductCategory } from "../generated/prisma";
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
  category = "",
  categories = [],
}: {
  query?: string;
  page?: number;
  category?: string;               // single category from dropdown/url
  categories?: ProductCategory[];  // multiple categories from URL
} = {}) {
  const skip = (page - 1) * PRODUCTS_PER_PAGE;

  const andFilters: any[] = [];

  if (query) {
    andFilters.push(searchWhere(query));
  }

  // Decide which categories to use:
  // - if multiple provided, use those
  // - otherwise fall back to single `category` if present
  const effectiveCategories: ProductCategory[] =
    categories.length > 0
      ? categories
      : category
      ? [category as ProductCategory]
      : [];

  if (effectiveCategories.length > 0) {
    andFilters.push({
      category: {
        in: effectiveCategories,
      },
    });
  }

  const where = andFilters.length > 0 ? { AND: andFilters } : {};

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
export async function getTotalBrowsePages(
  query: string = "",
  category?: string,
  selectedCategories: ProductCategory[] = []
): Promise<number> {
  const andFilters: any[] = [];

  if (query) {
    andFilters.push(searchWhere(query));
  }

  const effectiveCategories: ProductCategory[] =
    selectedCategories.length > 0
      ? selectedCategories
      : category
      ? [category as ProductCategory]
      : [];

  if (effectiveCategories.length > 0) {
    andFilters.push({
      category: {
        in: effectiveCategories, // always an array here
      },
    });
  }

  const where = andFilters.length > 0 ? { AND: andFilters } : {};

  const count = await prisma.product.count({ where });
  return Math.max(1, Math.ceil(count / PRODUCTS_PER_PAGE));
}


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
          // Add this if you want to show seller's other products
          products: {
            where: { id: { not: id } }, // exclude current product
            take: 4,
            orderBy: { createdAt: "desc" },
          },
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