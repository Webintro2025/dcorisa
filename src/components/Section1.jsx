
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

const services = [
	{
		title: "Bamboo Lighting Design",
		description: "Handcraft warm, organic glows tailored to your space with custom bamboo pendants, chandeliers, and wall pieces made by our artisans.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
				<path d="M42 20C42 30.4934 33.0457 39 22.5 39C11.9543 39 3 30.4934 3 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M45 13C45 23.4934 36.0457 32 25.5 32C14.9543 32 6 23.4934 6 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	{
		title: "Ambient Lighting Concepts",
		description: "Layer mood lighting that elevates living rooms, cafes, and resorts with curated lamp combinations, dimming plans, and accent highlights.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
				<path d="M42 20C42 30.4934 33.0457 39 22.5 39C11.9543 39 3 30.4934 3 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M45 13C45 23.4934 36.0457 32 25.5 32C14.9543 32 6 23.4934 6 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M39 27C39 37.4934 30.0457 46 19.5 46C8.9543 46 0 37.4934 0 27" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="translate(3 -2)"/>
			</svg>
		)
	},
	{
		title: "Lighting Consultation",
		description: "Get expert guidance on choosing the perfect lamp styles, lumen outputs, and eco-friendly materials for every zone in your project.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
				<path d="M42 20C42 30.4934 33.0457 39 22.5 39C11.9543 39 3 30.4934 3 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M45 13C45 23.4934 36.0457 32 25.5 32C14.9543 32 6 23.4934 6 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		)
	},
	{
		title: "Installation & Aftercare",
		description: "From precise onsite fitting to maintenance plans and quick replacements, we keep your decorative lighting glowing beautifully year-round.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
				<path d="M42 20C42 30.4934 33.0457 39 22.5 39C11.9543 39 3 30.4934 3 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M45 13C45 23.4934 36.0457 32 25.5 32C14.9543 32 6 23.4934 6 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M39 27C39 37.4934 30.0457 46 19.5 46C8.9543 46 0 37.4934 0 27" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="translate(3 -2)"/>
			</svg>
		)
	}
];

const FALLBACK_IMAGES = [
	"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
];

const Section1 = () => {
	const [categories, setCategories] = useState([]);
	const [categoriesLoading, setCategoriesLoading] = useState(false);
	const [categoriesError, setCategoriesError] = useState("");
	const carouselRef = useRef(null);

	useEffect(() => {
		let ignore = false;
		const loadCategories = async () => {
			setCategoriesLoading(true);
			setCategoriesError("");
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
					setCategoriesError(err.message || "Something went wrong");
				}
			} finally {
				if (!ignore) {
					setCategoriesLoading(false);
				}
			}
		};

		loadCategories();
		return () => {
			ignore = true;
		};
	}, []);

	const resolvedCategories = useMemo(() => {
		if (!categories || categories.length === 0) {
			return [];
		}
		return categories.map((category, index) => {
			const fallbackImage = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
			const safeImage = Array.isArray(category?.images) && category.images.length > 0
				? category.images[0]
				: fallbackImage;
			return {
				id: category?._id || String(index),
				name: category?.name || "Untitled Category",
				description: category?.description || "Beautiful lighting curated just for you.",
				image: safeImage,
			};
		});
	}, [categories]);

	const scrollCarousel = (direction) => {
		const node = carouselRef.current;
		if (!node) return;
		const amount = node.clientWidth * 0.8;
		node.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
	};

	return (
		<section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50" style={{fontFamily: 'Poppins, sans-serif'}}>
			<div className="max-w-7xl mx-auto text-center relative z-10">
				<a href="#" className="inline-block text-xs font-semibold tracking-widest text-gray-500 border border-gray-300 rounded-full px-4 py-1 mb-8">
					» WHO WE ARE
				</a>
				
				<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
					Experience <span className="text-amber-600">The Art Of Interior</span> Design
				</h1>
				
				<p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-gray-600">
					We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.
				</p>
			</div>

			<div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
				{services.map((service, idx) => (
					<div key={idx} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
						<div className="flex justify-between items-start mb-6">
							<h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
							<div className="text-amber-600">
								{service.icon}
							</div>
						</div>
						<p className="text-gray-600 leading-relaxed">
							{service.description}
						</p>
					</div>
				))}
			</div>

			{/* Enhanced Category Section */}
			<div className="mt-20 bg-gradient-to-br from-white to-gray-50 py-16 rounded-3xl shadow-xl border border-gray-100">
				{/* Section Title */}
				<div className="text-center mb-12">
					<span className="inline-block text-xs font-semibold tracking-widest text-amber-600 border border-amber-200 rounded-full px-4 py-1 mb-4">
						» SHOP BY ROOM
					</span>
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Explore Our <span className="text-amber-600">Premium Categories</span>
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Discover curated collections for every space in your home. From elegant living rooms to cozy bedrooms.
					</p>
				</div>

				{/* Carousel Container */}
				<div className="relative max-w-7xl mx-auto px-4">
					{/* Left Arrow */}
					<button
						type="button"
						onClick={() => scrollCarousel("left")}
						disabled={resolvedCategories.length === 0}
						className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center z-20 hover:bg-amber-50 hover:shadow-xl transition-all duration-300 border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
						</svg>
					</button>

					{/* Cards Wrapper */}
					<div
						ref={carouselRef}
						className="flex overflow-x-auto gap-6 scroll-smooth snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
					>
						{categoriesLoading && (
							<div className="flex w-full items-center justify-center py-20 text-gray-500">
								Loading categories...
							</div>
						)}
						{!categoriesLoading && categoriesError && (
							<div className="flex w-full items-center justify-center py-20 text-red-500">
								{categoriesError}
							</div>
						)}
						{!categoriesLoading && !categoriesError && resolvedCategories.length === 0 && (
							<div className="flex w-full items-center justify-center py-20 text-gray-500">
								No categories available yet.
							</div>
						)}
						{resolvedCategories.map((category) => (
							<div key={category.id} className="min-w-[250px] sm:min-w-[280px] lg:min-w-[300px] snap-start">
								<div className="relative overflow-hidden rounded-2xl shadow-lg group h-full">
									<img
										src={category.image}
										alt={category.name}
										className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-110"
										onError={(event) => {
											event.currentTarget.src = FALLBACK_IMAGES[0];
										}}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
									<div className="absolute bottom-0 left-0 right-0 p-6 text-center">
										<h3 className="text-2xl font-bold text-white mb-2">
											{category.name.toUpperCase()}
										</h3>
										<p className="text-sm text-white/80 mb-4 line-clamp-2">
											{category.description}
										</p>
										<button className="bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-semibold hover:bg-amber-100 transition-colors duration-300">
											Shop Now →
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Right Arrow */}
					<button
						type="button"
						onClick={() => scrollCarousel("right")}
						disabled={resolvedCategories.length === 0}
						className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center z-20 hover:bg-amber-50 hover:shadow-xl transition-all duration-300 border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>

				{/* Bottom CTA Section */}
				<div className="text-center mt-12">
					<button className="bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
						View All Categories
					</button>
				</div>
			</div>

			{/* Floating scroll to top button */}
			<a href="#" className="fixed bottom-8 right-8 bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-50">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
				</svg>
			</a>
		</section>
	);
};

export default Section1;
