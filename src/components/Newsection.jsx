"use client";

import React, { useState } from "react";

const services = [
	{
		id: "01",
		title: "Residential Interior Design",
		isActive: false
	},
	{
		id: "02", 
		title: "Outdoor & Landscape Design",
		isActive: false
	},
	{
		id: "03",
		title: "Interior Design Consultation", 
		isActive: false
	},
	{
		id: "04",
		title: "Commercial Interior Design",
		isActive: false
	},
	{
		id: "05",
		title: "Renovation And Remodeling",
		isActive: true
	},
	{
		id: "06",
		title: "Interior 2D/3D Layouts",
		isActive: false
	}
];

const Newsection = () => {
	const [hoveredService, setHoveredService] = useState(null);

	return (
		<section className="py-20 px-4 sm:px-6 lg:px-8" style={{fontFamily: 'Poppins, sans-serif'}}>
			<div className="max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="text-center max-w-4xl mx-auto mb-16">
					<h1 className="text-4xl sm:text-5xl font-light text-gray-900">
						Interior Design <span className="font-bold">Services</span>
					</h1>
					<p className="mt-4 text-base sm:text-lg text-gray-600">
						We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.
					</p>
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					
					{/* Image Section */}
					<div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
						<img 
							src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" 
							alt="Modern elegant living room interior design" 
							className="w-full h-full object-cover"
						/>
						
						<div className="absolute bottom-8 left-8 right-8 md:right-auto max-w-sm bg-gray-900/70 backdrop-blur-sm text-white p-6 rounded-xl">
							<p className="text-sm leading-relaxed">
								Overhauling existing spaces to modernize and improve functionality and aesthetics.
							</p>
						</div>
					</div>

					{/* Services List */}
					<div className="flex flex-col">
						{services.map((service, index) => (
							<a 
								key={service.id}
								href="#" 
								className={`group flex items-center justify-between p-6 transition-colors duration-300 ${
									index !== services.length - 1 ? 'border-b border-gray-200' : ''
								}`}
								onMouseEnter={() => setHoveredService(service.id)}
								onMouseLeave={() => setHoveredService(null)}
							>
								<div className="flex items-center space-x-6">
									<span className={`text-lg font-semibold transition-colors duration-300 ${
										service.isActive 
											? 'text-amber-600' 
											: hoveredService === service.id || service.isActive
												? 'text-amber-600'
												: 'text-gray-400'
									}`}>
										{service.id}
									</span>
									<h3 className={`text-xl font-bold transition-colors duration-300 ${
										service.isActive 
											? 'text-amber-600' 
											: hoveredService === service.id
												? 'text-amber-600'
												: 'text-gray-900'
									}`}>
										{service.title}
									</h3>
								</div>
								
								<div className="icon-wrapper">
									{service.isActive || hoveredService === service.id ? (
										<div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white transition-all duration-300">
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
											</svg>
										</div>
									) : (
										<svg className="w-6 h-6 text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
										</svg>
									)}
								</div>
							</a>
						))}
					</div>
				</div>
			</div>

			{/* Floating Scroll to Top Button */}
			<a 
				href="#" 
				className="fixed bottom-8 right-8 bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors duration-300 z-50"
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
				</svg>
			</a>
		</section>
	);
};

export default Newsection;
