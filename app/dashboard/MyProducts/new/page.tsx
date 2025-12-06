// app/dashboard/MyProducts/new/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProductForm from "@/components/ProductForm";

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-blue-50 py-10">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-8 text-4xl font-bold text-blue-900">
          Add New Product
        </h1>
        <ProductForm />
      </div>
    </div>
  );
}