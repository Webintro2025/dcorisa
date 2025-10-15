
"use client";
import React, { useState, useEffect } from "react";
import { Search, User, ShoppingBag } from "lucide-react";
import Popup from "./PopUpLogin";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

const Navbar = () => {
	const pathname = usePathname();
	const isHome = pathname === "/";
	const [isScrolled, setIsScrolled] = useState(() => (!isHome ? true : false));
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { openCart, cart } = useCart();
	const iconColorClass = isScrolled ? "text-black" : "text-white";
	const textColorClass = isScrolled ? "text-black" : "text-white";
	const hamburgerLineClass = isScrolled ? "bg-black" : "bg-white";
	const logoSrc = isHome && !isScrolled ? "/whitelogo.png" : "/logo.png";

	useEffect(() => {
		if (!isHome) {
			setIsScrolled(true);
			return undefined;
		}

		const handleScroll = () => {
			setIsScrolled(window.scrollY > 100);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isHome]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const token = localStorage.getItem("token");
		setIsLoggedIn(Boolean(token));  
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const handleStorage = (event) => {
			if (event.key === "token") {
				setIsLoggedIn(Boolean(event.newValue));
				if (!event.newValue) {
					setIsPopupOpen(false);
				}
			}
		};
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	useEffect(() => {
		if (isLoggedIn) {
			setIsPopupOpen(false);
			return undefined;
		}
		const timer = setTimeout(() => {
			setIsPopupOpen(true);
		}, 2000);
		return () => clearTimeout(timer);
	}, [isLoggedIn]);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		const handleLoginRequest = () => {
			setIsPopupOpen(true);
		};
		window.addEventListener("app:request-login", handleLoginRequest);
		return () => window.removeEventListener("app:request-login", handleLoginRequest);
	}, []);

	const handleLoginClick = () => {
		if (isLoggedIn) {
			return;
		}
		setIsPopupOpen(true);
	};

	const handleLoginSuccess = () => {
		setIsLoggedIn(true);
		setIsPopupOpen(false);
	};

	const handleLogout = () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("token");
			window.dispatchEvent(new CustomEvent("app:token-updated", { detail: "" }));
		}
		setIsLoggedIn(false);
		setIsPopupOpen(false);
	};

	return (
		<>
		<header className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
			isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
		}`}>
			{/* Left: Hamburger */}
			<div className="flex items-center">
				{!isSidebarOpen && (
					<button
						type="button"
						className="space-y-1"
						onClick={() => setIsSidebarOpen(true)}
						aria-label="Open menu"
					>
						<span className={`block w-5 h-0.5 transition-colors duration-300 ${hamburgerLineClass}`}></span>
						<span className={`block w-5 h-0.5 transition-colors duration-300 ${hamburgerLineClass}`}></span>
						<span className={`block w-5 h-0.5 transition-colors duration-300 ${hamburgerLineClass}`}></span>
					</button>
				)}
			</div>

			{/* Center: Logo */}
			<div className="text-center">
				<Link href="/" aria-label="Go to home">
					<img src={logoSrc} alt="Decor Era" className="h-12 mx-auto" />
				</Link>
			</div>

			{/* Right: Icons */}
			<div className={`flex items-center space-x-6 transition-colors duration-300 ${textColorClass}`}>
				{/* Search */}
				<div className="flex items-center space-x-1 cursor-pointer">
					<Search className={`w-5 h-5 transition-colors duration-300 ${iconColorClass}`} />
					<span className={`text-sm transition-colors duration-300 ${textColorClass}`}>Search</span>
				</div>
				{/* Log in / Log out */}
				{isLoggedIn ? (
					<button
						type="button"
						onClick={handleLogout}
						className="flex items-center space-x-1 cursor-pointer"
					>
						<User className={`w-5 h-5 transition-colors duration-300 ${iconColorClass}`} />
						<span className={`text-sm transition-colors duration-300 ${textColorClass}`}>Log out</span>
					</button>
				) : (
					<button
						type="button"
						onClick={handleLoginClick}
						className="flex items-center space-x-1 cursor-pointer"
					>
						<User className={`w-5 h-5 transition-colors duration-300 ${iconColorClass}`} />
						<span className={`text-sm transition-colors duration-300 ${textColorClass}`}>Log in</span>
					</button>
				)}
				{/* Cart */}
				<button
					type="button"
					onClick={openCart}
					className="relative flex items-center space-x-1 cursor-pointer"
					aria-label="Open cart"
				>
					<ShoppingBag className={`w-5 h-5 transition-colors duration-300 ${iconColorClass}`} />
					<span className={`text-sm transition-colors duration-300 ${textColorClass}`}>Cart</span>
					{cart.items.length > 0 && (
						<span className="absolute -right-3 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-600 px-1 text-[11px] font-semibold text-white">
							{cart.items.reduce((sum, item) => sum + item.quantity, 0)}
						</span>
					)}
				</button>
				
				{/* WhatsApp */}
			
			</div>
		</header>
		<Popup
			isOpen={isPopupOpen}
			onClose={() => setIsPopupOpen(false)}
			onSuccess={handleLoginSuccess}
		/>
		<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
		</>
	);
};

export default Navbar;
