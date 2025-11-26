
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="mb-8 inline-block rounded-full bg-amber-200 px-6 py-3 text-amber-900 font-semibold">
            Welcome to Handcrafted Haven
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Discover Unique<br />
            <span className="text-amber-600">Handmade Treasures</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Buy directly from real artisans. Every piece has a story.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/dashboard"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg px-10 py-5 rounded-full transition shadow-lg"
            >
              Start Selling →
            </Link>
            <Link
              href="/dashboard"
              className="bg-white hover:bg-gray-100 text-amber-700 font-bold text-lg px-10 py-5 rounded-full border-2 border-amber-600 transition shadow-lg"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </div>

      {/* Simple categories */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Shop by Craft</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["Woodwork", "Jewelry", "Textiles", "Ceramics"].map((cat) => (
              <div
                key={cat}
                className="group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition"
              >
                <div className="aspect-square bg-gray-200 border-2 border-dashed rounded-xl relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-2xl">
                    {cat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 bg-amber-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to find something truly special?
        </h2>
        <Link
          href="/dashboard"
          className="inline-block bg-white text-amber-600 hover:bg-gray-100 font-bold text-xl px-12 py-6 rounded-full transition"
        >
          Start Shopping Now
        </Link>
      </div>
    </div>
  );
}
