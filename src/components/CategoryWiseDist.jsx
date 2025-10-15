"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

const CategoryWiseDist = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    let ignore = false;
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/products");
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || "Unable to fetch products");
        }
        if (!ignore) {
          setProducts(Array.isArray(payload?.products) ? payload.products : []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProducts();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadCategories = async () => {
      setCategoryLoading(true);
      setCategoryError("");
      try {
        const response = await fetch("/api/categories");
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || "Unable to fetch categories");
        }
        if (!ignore) {
          setCategories(Array.isArray(payload?.categories) ? payload.categories : []);
        }
      } catch (err) {
        if (!ignore) {
          setCategoryError(err.message || "Something went wrong");
        }
      } finally {
        if (!ignore) {
          setCategoryLoading(false);
        }
      }
    };

    loadCategories();
    return () => {
      ignore = true;
    };
  }, []);

  const filters = useMemo(() => {
    const base = [{ key: "all", label: "All" }];
    const mapped = categories.map((category) => ({
      key: String(category?._id || category?.id || ""),
      label: category?.name || "Untitled",
    }));
    return base.concat(mapped);
  }, [categories]);

  useEffect(() => {
    if (activeFilter !== "all" && !filters.some((filter) => filter.key === activeFilter)) {
      setActiveFilter("all");
    }
  }, [filters, activeFilter]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") {
      return products;
    }
    return products.filter((product) => {
      const productCategoryId =
        product?.category?._id ||
        product?.category?.id ||
        (typeof product?.category === "string" ? product.category : null);
      return String(productCategoryId || "").toLowerCase() === activeFilter.toLowerCase();
    });
  }, [activeFilter, products]);

  const selectedCategory = useMemo(() => {
    if (activeFilter === "all") {
      return null;
    }
    return categories.find((category) => String(category?._id) === activeFilter);
  }, [categories, activeFilter]);

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-amber-50/30 py-20 sm:py-28"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-yellow-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-amber-200 px-4 py-1 text-xs font-semibold tracking-widest text-amber-600">
            » CURATED BY APPLICATION
          </span>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            Discover By <span className="text-amber-600">Category</span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Browse lighting concepts tailored for residential, commercial, and landscape environments. Pick a category to see pieces designed for that space.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-amber-600 text-white shadow-md"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-amber-400 hover:text-amber-600"
                }`}
              >
                {filter.label.toUpperCase()}
              </button>
            );
          })}
          {categoryLoading && (
            <span className="text-xs text-gray-400">Loading categories…</span>
          )}
          {!categoryLoading && categoryError && (
            <span className="text-xs text-red-500">{categoryError}</span>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="aspect-square w-full rounded-xl bg-gray-200" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
            {selectedCategory
              ? `No products available in ${selectedCategory?.name || "this category"} yet. Check back soon!`
              : "No products available yet. Check back soon!"}
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const productId = product?._id;
              const categoryName = product?.category?.name || "Lighting";
              const image = Array.isArray(product?.images) && product.images.length > 0 ? product.images[0] : FALLBACK_IMAGE;
              const price = typeof product?.price === "number" ? product.price : Number(product?.price) || 0;
              const description = product?.description || "Thoughtfully crafted lighting accent.";

              return (
                <Link
                  key={productId || product.name}
                  href={productId ? `/products/${productId}` : "#"}
                  className="group block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  aria-disabled={!productId}
                  tabIndex={productId ? 0 : -1}
                >
                  <div className="relative overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={image}
                      alt={product?.name || "Product image"}
                      className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-gray-700">
                      {categoryName.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-base font-semibold text-gray-900">{product?.name || "Untitled Product"}</h3>
                    <p className="line-clamp-2 text-xs text-gray-500">{description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(price)}</span>
                      <span className="text-[11px] uppercase tracking-[0.3em] text-amber-600">Explore</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryWiseDist;
