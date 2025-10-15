
"use client";

import React, { useState, useEffect } from "react";

const Premium = () => {
	const [currentOffer, setCurrentOffer] = useState(0);
	
	const offers = [
		{
			title: "PREMIUM LIGHTING",
			highlight: "SALE",
			discount: "40",
			description: "Luxury Chandeliers & Designer Lamps"
		},
		{
			title: "LED SOLUTIONS",
			highlight: "DEAL",
			discount: "30",
			description: "Smart Lighting & Energy Efficient"
		},
		{
			title: "OUTDOOR LIGHTS",
			highlight: "OFFER",
			discount: "35",
			description: "Garden & Pathway Illumination"
		}
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentOffer((prev) => (prev + 1) % offers.length);
		}, 4000);
		return () => clearInterval(interval);
	}, []);

	const offer = offers[currentOffer];

	return (
		<div className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 relative overflow-hidden" style={{fontFamily: 'Poppins, sans-serif'}}>
			{/* Animated Background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl animate-ping delay-2000"></div>
			</div>

			{/* Main Content */}
			<div className="relative flex items-center justify-between px-6 sm:px-10 py-8 min-h-[120px]">
				
				{/* Left Section - Brand & Title */}
				<div className="flex items-center space-x-6">
					{/* Decorative Elements */}
					<div className="hidden sm:flex items-center space-x-4">
						<div className="w-1 h-16 bg-gradient-to-b from-amber-400 to-yellow-600 rounded-full shadow-lg"></div>
						<div className="w-1 h-12 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full shadow-lg opacity-60"></div>
					</div>

					{/* Title with Animation */}
					<div className="flex flex-col">
						<div className="flex items-center space-x-2 mb-1">
							<svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
							</svg>
							<span className="text-xs font-semibold text-amber-400 tracking-widest">LUXURY LIGHTING</span>
						</div>
						<h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center">
							{offer.title}
							<span className="mx-2 text-3xl sm:text-4xl font-extrabold text-amber-400 animate-pulse">
								{offer.highlight}
							</span>
						</h2>
						<p className="text-xs sm:text-sm text-gray-300 mt-1">{offer.description}</p>
					</div>

					{/* Decorative Elements */}
					<div className="hidden sm:flex items-center space-x-4">
						<div className="w-1 h-12 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full shadow-lg opacity-60"></div>
						<div className="w-1 h-16 bg-gradient-to-b from-amber-400 to-yellow-600 rounded-full shadow-lg"></div>
					</div>
				</div>

				{/* Right Section - Offer & CTA */}
				<div className="flex items-center space-x-4 sm:space-x-8">
					{/* Discount Display */}
					<div className="flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-amber-400/30">
						<div className="flex items-baseline space-x-1">
							<span className="text-sm font-medium text-white">UP TO</span>
							<span className="text-4xl sm:text-5xl font-extrabold text-amber-400 animate-bounce">
								{offer.discount}
							</span>
							<span className="text-2xl font-bold text-amber-400">%</span>
							<span className="text-sm font-medium text-white">OFF</span>
						</div>
					</div>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
						<button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2">
							<span>Shop Now</span>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
							</svg>
						</button>
						<button className="border-2 border-amber-400 hover:bg-amber-400 text-amber-400 hover:text-black px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all duration-300 hidden sm:block">
							View All
						</button>
					</div>
				</div>
			</div>

			{/* Bottom Progress Indicators */}
			<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
				{offers.map((_, idx) => (
					<div 
						key={idx}
						className={`w-8 h-1 rounded-full transition-all duration-300 ${
							idx === currentOffer ? 'bg-amber-400' : 'bg-gray-600'
						}`}
					></div>
				))}
			</div>
		</div>
	);
};

export default Premium;
