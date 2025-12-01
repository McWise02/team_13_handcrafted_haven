// app/dashboard/MyProducts/new/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProductForm from "@/components/ProductForm";

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">Add New Product</h1>
        <ProductForm />
      </div>
    </div>
  );
}