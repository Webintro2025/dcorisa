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

const Product = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

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

	const resolvedProducts = useMemo(() => {
		if (!products || products.length === 0) {
			return [];
		}
		return products.map((product) => {
			const image = Array.isArray(product?.images) && product.images.length > 0 ? product.images[0] : FALLBACK_IMAGE;
			return {
				id: product?._id,
				name: product?.name || "Untitled Product",
				image,
				description: product?.description || "Handcrafted lighting to elevate your space.",
				price: typeof product?.price === "number" ? product.price : Number(product?.price) || 0,
				materialCare: product?.materialCare || product?.material || product?.care || "Premium bamboo & textiles",
				categoryName: product?.category?.name || "Lighting",
			};
		});
	}, [products]);

	const productSkeletons = useMemo(() => Array.from({ length: 5 }), []);

	return (
		<section className="p-4 sm:p-6 lg:p-8 bg-gray-50">
       
			<div className="container mx-auto">
												 <h2
													 className="text-center text-4xl mb-8 font-serif font-medium text-black drop-shadow-lg tracking-wide"
												 >
													 Trending Brands
												 </h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
					{loading &&
						productSkeletons.map((_, idx) => (
							<div key={idx} className="animate-pulse">
								<div className="aspect-square w-full rounded-2xl bg-gray-200" />
								<div className="mt-4 space-y-2">
									<div className="h-3 w-3/4 rounded bg-gray-200" />
									<div className="h-3 w-1/2 rounded bg-gray-200" />
									<div className="h-3 w-1/3 rounded bg-gray-200" />
								</div>
							</div>
						))}

					{!loading && error && (
						<div className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-sm text-red-600">
							{error}
						</div>
					)}

					{!loading && !error && resolvedProducts.length === 0 && (
						<div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
							No products available yet. Add lighting pieces through the admin panel.
						</div>
					)}

					{!loading && !error &&
						resolvedProducts.map((product) => (
							<Link
								key={product.id || product.name}
								href={product.id ? `/products/${product.id}` : "#"}
								aria-disabled={!product.id}
								tabIndex={product.id ? 0 : -1}
								className="block rounded-2xl border border-gray-100 bg-white p-3 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
							>
								<div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
									<img
										src={product.image}
										alt={product.name}
										className="h-full w-full object-cover object-center"
										onError={(event) => {
											event.currentTarget.src = FALLBACK_IMAGE;
										}}
									/>
								</div>
								<div className="mt-4">
									<p className="text-[11px] uppercase tracking-[0.3em] text-gray-400">{product.categoryName}</p>
									<h3 className="mt-2 text-sm font-medium text-gray-800">{product.name}</h3>
									<div className="mt-2 flex items-baseline gap-2">
										<span className="text-base font-bold text-gray-900">{formatCurrency(product.price)}</span>
										<span className="text-xs text-gray-500">{product.materialCare}</span>
									</div>
									<p className="mt-2 text-xs text-gray-500 line-clamp-2">{product.description}</p>
								</div>
							</Link>
						))}
				</div>
			</div>
		</section>
	);
};

export default Product;
