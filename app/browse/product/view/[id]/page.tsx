import { getProductForViewing } from "@/lib/data/products";
import { redirect } from "next/navigation";
import ImageCarousel from "@/app/ui/images/ImageCarousel";
import ReviewsCarousel from "@/app/ui/reviews/ReviewCarousel";
import OtherUserProductsCarousel from "@/app/ui/products/OtherUserProductsCarousel";
import CreateReviewForm from "@/app/ui/reviews/CreateReviewForm";
import { createReview } from "@/lib/actions/reviews";


type ViewProductPageParams = {
    id: string;
}


export default async function ViewProductPage({params} : {params: ViewProductPageParams}) {
    const param = await params;
    const productId = param.id;
    const product = await getProductForViewing(productId);
    if (!product) {
        redirect("/browse");
    }

    const other_user_products = product.user.products;

return (
  <div className="min-h-screen bg-slate-100">
    <div className="mx-auto max-w-6xl px-4 py-8 lg:py-10">
      {/* Header / Title */}
      <header className="mb-6 flex flex-col gap-2 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Product
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            {product.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Created by{" "}
            <span className="font-medium text-slate-800">
              {product.user.firstName} {product.user.lastName}
            </span>
          </p>
        </div>

        <div className="mt-3 flex items-end gap-4 md:mt-0">
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Price
            </p>
            <p className="text-2xl font-semibold text-blue-600">
              {product.price} €
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* Left column: Images + Description */}
        <section className="space-y-6">
          {/* Image card */}
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <ImageCarousel images={product.images} />
          </div>

          {/* Description card */}
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-2 text-lg font-semibold text-slate-900">
              Description
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              {product.description}
            </p>
          </div>

          {/* Other products from this user */}
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <OtherUserProductsCarousel products={other_user_products} />
          </div>
        </section>

        {/* Right column: Reviews + Create review */}
        <aside className="space-y-6">
          {/* Reviews */}
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Reviews
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {product.reviews.length} review
                {product.reviews.length === 1 ? "" : "s"}
              </span>
            </div>

            <ReviewsCarousel reviews={product.reviews} />
          </div>

          {/* Write a review */}
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Leave a review
            </h3>
            <p className="mb-3 text-xs text-slate-500">
              Share your experience with this product. Your feedback helps
              others in the community.
            </p>

            <CreateReviewForm
              action={createReview}
              productId={productId}
            />
          </div>
        </aside>
      </div>
    </div>
  </div>
);
}