import React from "react";

const Footer = () => {
	return (
		<footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden" style={{fontFamily: 'Poppins, sans-serif'}}>
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<svg className="w-full h-full" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
							<path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#grid)" />
				</svg>
			</div>

			<div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:py-24">
				{/* Header Section */}
				<div className="mb-16 text-center">
					<div className="mb-8 flex justify-center">
						<div className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 shadow-2xl border border-white/20">
							<img className="h-20" src="/logo.png" alt="Interior Design Studio Logo" />
						</div>
					</div>
					<h2 className="text-3xl font-bold text-white mb-4">
						Transform Your <span className="text-amber-400">Living Space</span>
					</h2>
					<p className="text-gray-300 max-w-2xl mx-auto">
						Creating exceptional interior experiences that blend functionality with aesthetic beauty. Your dream space awaits.
					</p>
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 gap-y-12 gap-x-8 text-sm md:grid-cols-2 lg:grid-cols-4">
					
					{/* Contact Information */}
					<div className="lg:col-span-1">
						<h4 className="text-lg font-bold text-amber-400 mb-6 flex items-center">
							<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
							</svg>
							Get In Touch
						</h4>
						<div className="space-y-4">
							<div className="flex items-start space-x-3">
								<svg className="w-5 h-5 text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
								</svg>
								<div>
									<p className="text-white font-medium">+91 XXXXXXXXXXXXX</p>
									<p className="text-gray-400 text-xs">Call us anytime</p>
								</div>
							</div>
							<div className="flex items-start space-x-3">
								<svg className="w-5 h-5 text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
									<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
								</svg>
								<div>
									<p className="text-white font-medium">hello@interiordesign.com</p>
									<p className="text-gray-400 text-xs">Send us an email</p>
								</div>
							</div>
							<div className="flex items-start space-x-3">
								<svg className="w-5 h-5 text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
								</svg>
								<div>
									<p className="text-white font-medium">Design Studio</p>
									<p className="text-gray-400 text-xs">Visit our showroom</p>
								</div>
							</div>
						</div>
					</div>

					{/* Services */}
					<div>
						<h4 className="text-lg font-bold text-amber-400 mb-6">Our Services</h4>
						<ul className="space-y-3">
							<li><a href="#" className="text-gray-300 hover:text-amber-400 transition-colors duration-300 flex items-center group">
								<span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
								Residential Design
							</a></li>
							<li><a href="#" className="text-gray-300 hover:text-amber-400 transition-colors duration-300 flex items-center group">
								<span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
								Commercial Spaces
							</a></li>
							<li><a href="#" className="text-gray-300 hover:text-amber-400 transition-colors duration-300 flex items-center group">
								<span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
								3D Visualization
							</a></li>
							<li><a href="#" className="text-gray-300 hover:text-amber-400 transition-colors duration-300 flex items-center group">
								<span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
								Consultation
							</a></li>
						</ul>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="text-lg font-bold text-amber-400 mb-6">Quick Links</h4>
						<ul className="space-y-3">
							<li><a href="#" className="text-gray-300 hover:text-amber-400 transition-colors duration-300 flex items-center group">
								<span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
								About Us
							</a></li>
							<li><a href="#" className="text-gray-300 hover:text-amber-400 transition-colors duration-300 flex items-center group">
								<span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
								Portfolio
							</a></li>
							<li><a href="#" className="text-gray-300 hover:text-amber-400 transition-colors duration-300 flex items-center group">
								<span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
								Contact
							</a></li>
							<li><a href="#" className="text-gray-300 hover:text-amber-400 transition-colors duration-300 flex items-center group">
								<span className="w-1 h-1 bg-amber-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
								Privacy Policy
							</a></li>
						</ul>
					</div>

					{/* Newsletter */}
					<div>
						<h4 className="text-lg font-bold text-amber-400 mb-6">Stay Updated</h4>
						<p className="text-gray-300 mb-4 text-sm">Subscribe to get design tips and latest trends.</p>
						<div className="space-y-4">
							<div className="flex">
								<input 
									type="email" 
									placeholder="Enter email" 
									className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
								/>
								<button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-r-lg transition-colors duration-300">
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
									</svg>
								</button>
							</div>
							
							{/* Social Media */}
							<div className="flex space-x-4 pt-4">
								<a href="#" className="w-10 h-10 bg-white/10 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors duration-300 group">
									<svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
										<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
									</svg>
								</a>
								<a href="#" className="w-10 h-10 bg-white/10 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors duration-300 group">
									<svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.001 12.017.001"/>
									</svg>
								</a>
								<a href="#" className="w-10 h-10 bg-white/10 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors duration-300 group">
									<svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
									</svg>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
            <SubFooter />
		</footer>
	);
};

export default Footer;

export const SubFooter = () => (
	<div className="bg-black border-t border-gray-800">
		<div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
			<div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
				<div className="flex items-center space-x-6">
					<p className="text-sm text-gray-400">
						© 2025 Interior Design Studio. All Rights Reserved.
					</p>
				</div>
				
				<div className="flex items-center space-x-6">
					<div className="flex items-center space-x-2">
						<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
						<span className="text-sm text-gray-400">24/7 Available</span>
					</div>
					<p className="text-sm text-gray-400">
						Developed by
						<a href="https://webintro.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 ml-1 transition-colors">
							<svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
							</svg>
							WebIntro.in
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
);
