// app/dashboard/DashboardOverview/page.tsx

import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Star,
  PlusCircle,
} from "lucide-react";

export const revalidate = 60;

export default async function DashboardOverview() {
  const [totalProducts, totalUsers, recentProducts, topSellers] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { products: { _count: "desc" } },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  const totalOrders = 0;
  const totalRevenue = 0.0;

  const stats = [
    { label: "Total Products", value: totalProducts, icon: Package, color: "blue" },
    { label: "Artisans", value: totalUsers, icon: Users, color: "emerald" },
    { label: "Orders", value: totalOrders, icon: ShoppingBag, color: "indigo" },
    { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "rose" },
  ];

  const formatName = (
    user: { firstName?: string | null; lastName?: string | null } | null
  ): string => {
    if (!user) return "Artisan";
    const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    return name || "Artisan";
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-blue-700">
            Welcome back! Here’s what’s happening in your marketplace today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition border border-blue-100"
            >
              <div className={`p-4 rounded-xl bg-${stat.color}-100 text-${stat.color}-600`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-blue-900">Recent Listings</h2>
              <Link
                href="/dashboard/MyProductsList"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
              >
                View all <TrendingUp className="h-4 w-4" />
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No products yet. Be the first to list something!
              </p>
            ) : (
              <div className="space-y-4">
                {recentProducts.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/dashboard/MyProductsList/${product.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition group"
                  >
                    <div className="relative w-16 h-16 bg-blue-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-blue-300 m-auto" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium group-hover:text-blue-700 transition">
                        {product.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        by {formatName(product.user)} •{" "}
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="font-bold text-blue-600">
                      ${((product.price || 0) / 100).toFixed(2)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Top Artisans */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-blue-900">Top Artisans</h2>
              <Star className="h-6 w-6 text-blue-500" />
            </div>

            <div className="space-y-4">
              {topSellers.map((seller: any, idx: number) => (
                <div
                  key={seller.id}
                  className="flex items-center justify-between py-3 border-b border-blue-100 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-blue-200">#{idx + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {seller.firstName} {seller.lastName || ""}
                      </p>
                      <p className="text-sm text-gray-600">
                        {seller._count.products} items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-blue-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/users"
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-medium transition shadow-md"
            >
              <Users className="h-5 w-5" />
              View All Artisans
            </Link>
          </div>
        </div>

        {/* Quick Action */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard/MyProductsList/new"
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full transition text-lg shadow-xl transform hover:scale-105"
          >
            <PlusCircle className="h-6 w-6" />
            List a New Handmade Item
          </Link>
        </div>
      </div>
    </div>
  );
}