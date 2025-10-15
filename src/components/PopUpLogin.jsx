"use client";
import React, { useState, useEffect } from "react";

const Popup = ({ isOpen, onClose, onSuccess }) => {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [feedback, setFeedback] = useState({ text: "", isError: false });

	useEffect(() => {
		if (!isOpen) {
			setEmail("");
			setOtp("");
			setStep(1);
			setLoading(false);
			setFeedback({ text: "", isError: false });
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const closePopup = () => {
		onClose?.();
	};

	const handleSendOtp = async (event) => {
		event.preventDefault();
		setLoading(true);
		setFeedback({ text: "", isError: false });
		try {
			const response = await fetch("/api/auth/send-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Unable to send OTP");
			}
			setStep(2);
			setFeedback({ text: "OTP sent to your email address", isError: false });
		} catch (error) {
			setFeedback({ text: error.message, isError: true });
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async (event) => {
		event.preventDefault();
		setLoading(true);
		setFeedback({ text: "", isError: false });
		try {
			const response = await fetch("/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, otp }),
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Invalid OTP");
			}
			if (data.token) {
				localStorage.setItem("token", data.token);
				if (typeof window !== "undefined") {
					window.dispatchEvent(new CustomEvent("app:token-updated", { detail: data.token }));
				}
			}
			setFeedback({ text: "Login successful", isError: false });
			onSuccess?.(data.token || null);
			closePopup();
		} catch (error) {
			setFeedback({ text: error.message, isError: true });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-transparent flex items-center justify-center min-h-screen z-50">
			<div className="w-[900px] bg-white shadow-lg rounded-md overflow-hidden flex relative">
				{/* Left Image */}
				<div className="w-1/2">
					<img src="/banner2.webp" alt="Lounge" className="w-full h-full object-cover" />
				</div>

				{/* Right Form Section */}
				<div className="w-1/2 p-10 relative flex flex-col justify-center">
					{/* Close Button */}
					<button
						type="button"
						className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
						onClick={closePopup}
						aria-label="Close"
					>
						&times;
					</button>

					{/* Logo */}
					<h2 className="text-center text-xl tracking-[0.5em] text-gray-700 mb-6">
						<span className="text-orange-500">XX</span>XXXX
					</h2>

					{/* Heading */}
					<h1 className="text-center text-xl font-bold text-gray-800 mb-3">
						EXCLUSIVE FIRST-TIME SHOPPER PERK!
					</h1>
					<p className="text-center text-gray-600 mb-6">
						Subscribe now and unlock your exclusive first-time shopper discount.
					</p>

					{/* Form */}
					{step === 1 && (
						<form className="space-y-4" onSubmit={handleSendOtp}>
							<input
								type="email"
								placeholder="Email address"
								className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								required
							/>
							<button
								type="submit"
								className="w-full bg-gray-700 text-white font-semibold py-3 rounded shadow hover:bg-gray-800 transition disabled:opacity-70"
								disabled={loading}
							>
								{loading ? "Sending OTP..." : "Send OTP"}
							</button>
						</form>
					)}
					{step === 2 && (
						<form className="space-y-4" onSubmit={handleVerifyOtp}>
							<input
								type="text"
								placeholder="Enter OTP"
								className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
								value={otp}
								onChange={(event) => setOtp(event.target.value)}
								required
							/>
							<button
								type="submit"
								className="w-full bg-gray-700 text-white font-semibold py-3 rounded shadow hover:bg-gray-800 transition disabled:opacity-70"
								disabled={loading}
							>
								{loading ? "Verifying..." : "Verify OTP"}
							</button>
						</form>
					)}
					{feedback.text && (
						<p
							className={`text-center text-sm mt-4 ${feedback.isError ? "text-red-500" : "text-green-600"}`}
						>
							{feedback.text}
						</p>
					)}

					{/* Footer Note */}
					<p className="text-center text-gray-500 text-sm mt-4">
						Don’t miss out—this special offer is just for you!
					</p>
				</div>
			</div>
		</div>
	);
};

export default Popup;
