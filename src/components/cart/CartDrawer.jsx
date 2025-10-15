"use client";

import React, { useMemo } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80";

const CartDrawer = () => {
  const { cart, isOpen, isLoading, closeCart, updateQuantity, lastError } = useCart();
  const router = useRouter();

  const totalItems = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items]
  );

  const formattedTotal = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(cart.total || 0);
  }, [cart.total]);

  const handleIncrease = (productId) => {
    updateQuantity({ productId, action: "increase" });
  };

  const handleDecrease = (productId, quantity) => {
    if (quantity <= 1) {
      updateQuantity({ productId, quantity: 0 });
    } else {
      updateQuantity({ productId, action: "decrease" });
    }
  };

  const handleRemove = (productId) => {
    updateQuantity({ productId, quantity: 0 });
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      return;
    }
    closeCart();
    router.push("/checkout");
  };

  return (
    <div
      className={`fixed inset-0 z-[80] transition-opacity duration-300 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
            <div>
              <p className="text-sm font-semibold text-gray-900">Cart</p>
              <p className="text-xs text-gray-500">{totalItems} item{totalItems === 1 ? "" : "s"}</p>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-900"
              aria-label="Close cart"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {lastError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {lastError}
              </div>
            )}
            {cart.items.length === 0 && !isLoading ? (
              <p className="text-sm text-gray-500">Your cart is currently empty.</p>
            ) : (
              <ul className="space-y-6">
                {cart.items.map((item) => {
                  const displayPrice = new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(item.price || 0);
                  const mrp = Math.round((item.price || 0) * 1.2);
                  const formattedMrp = new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(mrp);
                  const savings = mrp - (item.price || 0);
                  const savingsText = savings > 0 ? `You are getting ${new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(savings)} off per item` : null;

                  return (
                    <li key={item.productId} className="flex gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={item.image || FALLBACK_IMAGE}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                              <span className="line-through">{formattedMrp}</span>
                              <span className="text-amber-600 font-semibold">{displayPrice}</span>
                            </div>
                            {savingsText && <p className="mt-1 text-xs text-gray-500">{savingsText}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.productId)}
                            className="text-gray-400 hover:text-gray-700"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex w-28 items-center justify-between rounded-full border border-gray-200 px-3 py-1">
                          <button
                            type="button"
                            onClick={() => handleDecrease(item.productId, item.quantity)}
                            className="p-1 text-gray-600 hover:text-gray-900"
                            aria-label="Decrease quantity"
                            disabled={isLoading}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-medium text-gray-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleIncrease(item.productId)}
                            className="p-1 text-gray-600 hover:text-gray-900"
                            aria-label="Increase quantity"
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <footer className="border-t border-gray-200 px-6 py-5">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">{formattedTotal}</span>
            </div>
            <p className="mt-2 text-xs text-gray-400">Shipping & taxes calculated at checkout</p>
            <button
              type="button"
              onClick={handleCheckout}
              className="mt-5 w-full rounded-full bg-[#6b3a24] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#59311c] disabled:cursor-not-allowed disabled:bg-[#6b3a24]/60"
              disabled={cart.items.length === 0}
            >
              Checkout · {formattedTotal} INR
            </button>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Need help?</span>
              <Link href="https://wa.me/" className="inline-flex items-center gap-2 rounded-full bg-[#6b3a24]/10 px-3 py-1 text-[#6b3a24]">
                <span className="text-xs font-medium">Chat on WhatsApp</span>
              </Link>
            </div>
          </footer>
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
