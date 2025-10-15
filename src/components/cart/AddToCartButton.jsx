"use client";

import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useCart } from "./CartProvider";

const sanitizeProductPayload = (product) => {
  if (!product || typeof product !== "object") {
    return null;
  }

  const productId = product.productId || product.id || product._id;
  if (!productId) {
    return null;
  }

  const price = typeof product.price === "number" ? product.price : Number(product.price) || 0;
  const image = Array.isArray(product.images) ? product.images[0] : product.image;

  return {
    productId,
    name: product.name || "Untitled Product",
    price,
    image,
  };
};

const AddToCartButton = ({ product, className = "" }) => {
  const { addItem, isLoading } = useCart();
  const payload = useMemo(() => sanitizeProductPayload(product), [product]);

  const handleAddToCart = () => {
    if (!payload) {
      console.warn("Missing product data for cart payload");
      return;
    }
    addItem(payload);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!payload || isLoading}
      className={`flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 px-8 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300 ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Adding…</span>
        </>
      ) : (
        <span>Add to Cart</span>
      )}
    </button>
  );
};

export default AddToCartButton;
