// app/products/[id]/page.tsx
import { getProductForViewing } from "@/lib/data/products";
import { redirect } from "next/navigation";
import ImageCarousel from "@/app/ui/images/ImageCarousel";
import ReviewsCarousel from "@/app/ui/reviews/ReviewCarousel";
import OtherUserProductsCarousel from "@/app/ui/products/OtherUserProductsCarousel";
import CreateReviewForm from "@/app/ui/reviews/CreateReviewForm";
import { createReview } from "@/lib/actions/reviews";
import { getCurrentUser } from "@/lib/get-current-user";
import ContactSellerButton from "@/app/ui/products/ContactSellerButton";

type ViewProductPageParams = {
  id: string;
};

export default async function ViewProductPage({
  params,
}: {
  params: ViewProductPageParams;
}) {
  const param = await params;
  const productId = param.id;
  const product = await getProductForViewing(productId);
  const user = await getCurrentUser();

  if (!product) {
    redirect("/browse");
  }

  const other_user_products = product.user.products.filter(p => p.id !== product.id);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:py-10">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Product
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              {product.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Created by{" "}
              <span className="font-medium text-slate-800">
                {product.user.firstName} {product.user.lastName}
              </span>
            </p>
          </div>

          {/* Price + Contact Button */}
          <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-end">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Price
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {(product.price / 100).toFixed(2)} €
              </p>
            </div>

            <ContactSellerButton
              firstName={product.user.firstName}
              email={product.user.email}
              title={product.title}
            />
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Left Column */}
          <section className="space-y-8">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
              <ImageCarousel images={product.images} />
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {product.craftStory && (
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm ring-1 ring-amber-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-full bg-amber-200 p-3">
                    <svg className="h-7 w-7 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="mb-3 text-xl font-semibold text-amber-900">
                      The Craft Story
                    </h2>
                    <div className="prose prose-sm text-amber-800 max-w-none">
                      {product.craftStory.split("\n").map((p, i) => (
                        <p key={i} className={i > 0 ? "mt-4" : ""}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {other_user_products.length > 0 && (
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                  More from this seller
                </h2>
                <OtherUserProductsCarousel products={other_user_products} />
              </div>
            )}
          </section>

          {/* Right Column */}
          <aside className="space-y-8">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {product.reviews.length} review{product.reviews.length !== 1 && "s"}
                </span>
              </div>
              <ReviewsCarousel reviews={product.reviews} />
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Leave a Review
              </h3>
              <p className="mb-4 text-sm text-slate-600">
                Share your experience to help others in the community.
              </p>
              <CreateReviewForm action={createReview} productId={productId} user={user} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}