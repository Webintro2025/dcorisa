import React from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80";

const formatCurrency = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Rs. 0";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

async function fetchProduct(id) {
  const headerList = headers();
  const protocol = headerList.get("x-forwarded-proto") || "http";
  const host = headerList.get("x-forwarded-host") || headerList.get("host") || "localhost:3000";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

  const response = await fetch(`${baseUrl}/api/products?id=${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  const payload = await response.json();
  return payload?.product || null;
}

const ProductDetailPage = async ({ params }) => {
  const productId = params?.id;

  if (!productId) {
    notFound();
  }

  let product;
  try {
    product = await fetchProduct(productId);
  } catch (err) {
    console.error("Unable to fetch product", err);
    product = null;
  }

  if (!product) {
    notFound();
  }

  const images = Array.isArray(product?.images) && product.images.length > 0 ? product.images : [FALLBACK_IMAGE];
  const primaryImage = images[0] || FALLBACK_IMAGE;
  const categoryName = product?.category?.name || "Lighting";
  const description = product?.description || "Handcrafted lighting to elevate your space.";
  const materialCare =
    product?.materialCare ||
    product?.material ||
    product?.care ||
    "Premium bamboo & textiles";
  const dimension = product?.dimension || "Standard dimensions available on request.";
  const price = typeof product?.price === "number" ? product.price : Number(product?.price) || 0;
  const quantity = typeof product?.quantity === "number" ? product.quantity : Number(product?.quantity) || 0;
  const productName = product?.name || "Decorative Lighting";
  const computedMrp = price > 0 ? Math.round(price * 1.15) : 0;
  const discountLabel = price > 0 ? `${Math.max(5, Math.min(45, Math.round(((computedMrp - price) / computedMrp) * 100)))}% OFF` : null;
  const breadcrumbs = ["Home", categoryName, productName];
  const additionalImages = images.slice(1, 5);
  const cartProductPayload = {
    productId,
    name: productName,
    price,
    images,
  };

  return (
    <section className="bg-[#f8f4ef] px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.4em] text-gray-400">
          {breadcrumbs.map((item, index) => (
            <span key={item}>
              {index > 0 && <span className="px-2 text-gray-300">/</span>}
              <span className={index === breadcrumbs.length - 1 ? "text-gray-500" : "text-gray-400"}>{item}</span>
            </span>
          ))}
        </nav>

        <div className="mt-6 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-sm">
              <div className="overflow-hidden rounded-2xl bg-gray-100">
                <img src={primaryImage} alt={productName} className="w-full object-cover" style={{ maxHeight: "520px" }} />
              </div>
            </div>

            {additionalImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {additionalImages.map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2">
                    <img src={image} alt={`${productName} alternate ${index + 1}`} className="aspect-square w-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase text-gray-500">Material & Care</p>
                <p className="mt-2 text-sm text-gray-700">{materialCare}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase text-gray-500">Dimensions</p>
                <p className="mt-2 text-sm text-gray-700">{dimension}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:col-span-1">
                <p className="text-xs uppercase text-gray-500">Category</p>
                <p className="mt-2 text-sm text-gray-700">{categoryName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <header className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">{productName}</h1>
                  <p className="mt-2 text-sm text-gray-500">Handwoven lighting accent crafted by local artisans.</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-lg text-gray-400">
                  ♡
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1 text-amber-600">★★★★★</span>
                <span>4.8 · 32 reviews</span>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <p className="text-3xl font-semibold text-gray-900">{formatCurrency(price)}</p>
                {computedMrp > price && (
                  <>
                    <span className="text-sm text-gray-400 line-through">{formatCurrency(computedMrp)}</span>
                    {discountLabel && <span className="text-sm font-semibold text-emerald-600">{discountLabel}</span>}
                  </>
                )}
              </div>
              <p className="mt-6 text-sm leading-6 text-gray-600 whitespace-pre-line">{description}</p>
            </header>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-900">Place Your Order</p>
              <div className="mt-4">
                <AddToCartButton product={cartProductPayload} />
              </div>
              <p className="mt-4 text-xs text-gray-500">Ships in 6-7 business days with complimentary installation support.</p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-900">Stock Status</p>
              <p className="mt-2 text-base text-gray-800">{quantity > 0 ? `Available (${quantity} in stock)` : "Made to order"}</p>
              <p className="mt-4 text-sm text-gray-600">For bulk orders or custom sizing, connect with our studio concierge.</p>
            </div>

            <div className="space-y-3">
              <details className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-semibold text-gray-900">Specifications</summary>
                <p className="mt-3 text-sm text-gray-600">Handwoven bamboo weave, powder coated frame, warm LED compatible fittings.</p>
              </details>
              <details className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-semibold text-gray-900">Description</summary>
                <p className="mt-3 text-sm text-gray-600 whitespace-pre-line">{description}</p>
              </details>
              <details className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-semibold text-gray-900">Material & Care</summary>
                <p className="mt-3 text-sm text-gray-600">{materialCare}</p>
              </details>
              <details className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-semibold text-gray-900">Shipping & Returns</summary>
                <p className="mt-3 text-sm text-gray-600">Dispatched within 48 hours. Eligible for complementary installation and 10-day easy return on manufacturing defects.</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
