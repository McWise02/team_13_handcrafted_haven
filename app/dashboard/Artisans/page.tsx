import { Trash2, Edit, Plus, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 60;

export default async function ArtisansPage() {
  const artisans = await prisma.user.findMany({
    where: { role: "USER" },
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Artisans
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage all artisans registered on the platform.
          </p>
        </div>

        <Link
          href="/dashboard/artisans/create"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Artisan
        </Link>
      </div>

      {/* Empty */}
      {artisans.length === 0 && (
        <div className="p-10 bg-white border rounded-xl shadow-sm text-center">
          <p className="text-slate-700 text-sm">No artisans found.</p>
        </div>
      )}

      {/* Grid List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.map((artisan) => {
          const fullName = `${artisan.firstName || ""} ${artisan.lastName || ""}`.trim() || "Unnamed User";

          return (
            <div
              key={artisan.id}
              className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                {/* Avatar from initials */}
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-lg">
                  {artisan.firstName?.charAt(0) || artisan.lastName?.charAt(0) || "U"}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {fullName}
                  </h2>
                  <p className="text-sm text-slate-600">{artisan.email}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
                  Role: USER
                </span>

                <span className="text-xs text-slate-600">
                  Products: {artisan._count.products}
                </span>
              </div>

              {/* Buttons */}
              <div className="mt-5 flex items-center justify-between">
                <Link
                  href={`/dashboard/artisans/${artisan.id}/edit`}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>

                <form action={`/dashboard/artisans/${artisan.id}/delete`} method="POST">
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


