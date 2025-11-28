// prisma/seed-products.ts
import { prisma } from "@/lib/prisma";

/* -------------------------------------------------------------
   1. Use literal strings – Prisma enums are just strings at runtime
   ------------------------------------------------------------- */
const TEXTILE = "TEXTILE" as const;
const METALWORK = "METALWORK" as const;
const WOODWORK = "WOODWORK" as const;

/* -------------------------------------------------------------
   2. Remove `as const` from the array so TypeScript doesn't make it readonly
   ------------------------------------------------------------- */
const sampleProducts = [
  {
    id: "prod_001",
    title: "Handwoven Cotton Throw Blanket",
    description: "Soft, breathable 100% cotton throw with traditional patterns.",
    price: 8900,
    category: TEXTILE,
    images: [
      "https://utfs.io/f/9d8f4c2a-b8e1-4f2a-9d3e-1a2b3c4d5e6f",
      "https://utfs.io/f/8e7d6c5b-a4f3-2e1d-9c8b-7a6f5e4d3c2b",
    ],
    userId: "user_demo_123", // ← make sure this user exists!
  },
  {
    id: "prod_002",
    title: "Forged Iron Wall Hook Set (4pcs)",
    description: "Hand-forged iron hooks with rustic finish. Perfect for entryways.",
    price: 4500,
    category: METALWORK,
    images: ["https://utfs.io/f/1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6"],
    userId: "user_demo_123",
  },
  {
    id: "prod_003",
    title: "Reclaimed Oak Cutting Board",
    description: "End-grain oak board with juice groove and leather handle.",
    price: 12500,
    category: WOODWORK,
    images: [
      "https://utfs.io/f/a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      "https://utfs.io/f/b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7",
    ],
    userId: "user_demo_123",
  },
  // Add more products below...
];

/* -------------------------------------------------------------
   3. Seed – no type assertions needed
   ------------------------------------------------------------- */
async function main() {
  console.log("Starting product seeding...");

  for (const p of sampleProducts) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        category: p.category,
        images: { set: p.images }, // set makes it mutable → no readonly error
        userId: p.userId,
      },
    });
    console.log(`Seeded: ${p.title}`);
  }

  console.log("Product seeding completed!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });