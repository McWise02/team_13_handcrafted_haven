// app/page.tsx
import MarketLogo from '@/app/ui/Logo';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  const categories = [
    {
      value: 'WOODWORK',
      label: 'Woodwork',
      image: 'https://images.pexels.com/photos/326311/pexels-photo-326311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Handcrafted wooden bowl and tools',
    },
    {
      value: 'TEXTILE',
      label: 'Textiles',
      image: 'https://images.pexels.com/photos/3756048/pexels-photo-3756048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Colorful handwoven textiles',
    },
    {
      value: 'METALWORK',
      label: 'Metalwork',
      image: 'https://images.pexels.com/photos/6693193/pexels-photo-6693193.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Artisan forging metal jewelry',
    },
  ] as const;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.pexels.com/photos/6693193/pexels-photo-6693193.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Artisan workspace"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 text-center">
          <div className="flex justify-center mb-12">
            <div className="p-8 bg-gradient-to-br from-blue-700 to-blue-800 rounded-3xl shadow-2xl ring-8 ring-blue-600/30 transform hover:scale-105 transition">
              <MarketLogo />
            </div>
          </div>

          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-blue-200 px-8 py-4 text-blue-900 font-bold text-lg shadow-md">
            Welcome to Handcrafted Haven
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
            Discover Unique<br />
            <span className="text-blue-600">Handmade Treasures</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Buy directly from real artisans. Every piece tells a story, made with love — never mass-produced.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-5 rounded-full transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Login and Start Selling Today
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition" />
            </Link>

            <Link
              href="/browse"
              className="inline-flex items-center justify-center bg-white hover:bg-blue-50 text-blue-700 font-bold text-lg px-10 py-5 rounded-full border-2 border-blue-600 transition-all shadow-xl"
            >
              Explore the Marketplace
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 100C120 80 240 40 360 30C480 20 600 40 720 50C840 60 960 60 1080 50C1200 40 1320 20 1380 10L1440 0V120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6 text-gray-900">
            Shop by Craft
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Handpicked creations from talented makers around the world
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/browse?category=${cat.value}`}
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-6"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover brightness-90 group-hover:brightness-75 transition-all duration-500 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-10 text-center">
                    <h3 className="text-4xl font-bold text-white drop-shadow-2xl mb-3">
                      {cat.label}
                    </h3>
                    <p className="text-blue-300 font-semibold text-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      Explore Collection
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 bg-gradient-to-r from-blue-600 to-cyan-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.pexels.com/photos/3756048/pexels-photo-3756048.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Handmade textiles"
            fill
            className="object-cover mix-blend-overlay"
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 drop-shadow-lg">
            Ready to find something truly special?
          </h2>
          <p className="text-xl mb-10 opacity-90 text-blue-50">
            Join thousands who choose handmade over ordinary.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-4 bg-white text-blue-600 hover:bg-blue-50 font-bold text-xl px-16 py-7 rounded-full transition-all transform hover:scale-105 shadow-2xl"
          >
            Start Shopping Now
            <ArrowRight className="w-7 h-7" />
          </Link>
        </div>
      </section>
    </>
  );
}
