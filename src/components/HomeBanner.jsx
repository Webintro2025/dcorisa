
import React from "react";

const HomeBanner = () => {
		return (
			<div
				className="relative h-screen bg-cover bg-center text-white"
				style={{ backgroundImage: "url('/banner1.png')" }}
			>
				<div className="absolute inset-0 bg-black/20" />
				<main
					className="relative z-10 container mx-auto px-6 flex flex-col justify-center"
					style={{ height: "calc(100vh - 96px)" }}
				>
					<div className="max-w-3xl">
						<p className="flex items-center space-x-2 text-sm font-semibold tracking-widest text-amber-600 mb-4">
							<span className="w-3 h-3 bg-amber-600 rounded-full"></span>
							<span>PREMIUM LIGHTING SOLUTIONS</span>
						</p>
						<h1 className="text-6xl md:text-8xl font-bold leading-tight text-shadow-lg" style={{ fontFamily: "'Jost', sans-serif" }}>
							Illuminate Your Beautiful Space
						</h1>
						<p className="mt-6 text-lg text-white max-w-xl text-shadow">
							Transform your home with our premium collection of handcrafted lights and lamps. Create the perfect ambiance for every moment.
						</p>
						<a
							href="#"
							className="mt-8 inline-flex items-center space-x-3 border border-white rounded-full px-8 py-3 font-semibold hover:bg-white hover:text-black transition-colors duration-300"
						>
							<span>Shop Collection</span>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
							</svg>
						</a>
					</div>

					<div className="absolute bottom-10 left-1/2 -translate-x-1/2">
						<a href="#" className="bg-white text-black rounded-full p-3 block animate-bounce">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
							</svg>
						</a>
					</div>
				</main>
			</div>
	);
};

export default HomeBanner;
