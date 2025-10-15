"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

function decodeBase64(input) {
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    return window.atob(input);
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "base64").toString("utf8");
  }
  return "";
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") {
    return null;
  }
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = decodeBase64(padded);
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to decode token payload", error);
    return null;
  }
}

function extractUserIdFromToken(token) {
  const payload = decodeJwtPayload(token);
  return payload?.userId ? String(payload.userId) : null;
}

function getInitialUserId() {
  if (typeof window === "undefined") {
    return null;
  }
  const storedToken = window.localStorage.getItem("token");
  return extractUserIdFromToken(storedToken);
}

const emptyCart = { items: [], total: 0 };

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(emptyCart);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState("");
  const [userId, setUserId] = useState(getInitialUserId);
  const [userIdListeners, setUserIdListeners] = useState([]);

  const syncUserId = useCallback((tokenValue) => {
    const resolvedUserId = extractUserIdFromToken(tokenValue);
    setUserId((prev) => {
      if (prev !== resolvedUserId) {
        setUserIdListeners((listeners) => {
          listeners.forEach((listener) => {
            try {
              listener(resolvedUserId);
            } catch (err) {
              console.error("CartProvider listener failed", err);
            }
          });
          return listeners;
        });
      }
      return resolvedUserId;
    });
    if (!resolvedUserId) {
      setCart(emptyCart);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const token = window.localStorage.getItem("token");
    syncUserId(token);

    const handleStorage = (event) => {
      if (event.key === "token") {
        syncUserId(event.newValue || "");
      }
    };

    const handleTokenUpdated = (event) => {
      const nextToken = typeof event?.detail === "string" ? event.detail : window.localStorage.getItem("token");
      syncUserId(nextToken || "");
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("app:token-updated", handleTokenUpdated);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("app:token-updated", handleTokenUpdated);
    };
  }, [syncUserId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const openListener = () => setIsOpen(true);
    const closeListener = () => setIsOpen(false);

    window.addEventListener("app:open-cart", openListener);
    window.addEventListener("app:close-cart", closeListener);

    return () => {
      window.removeEventListener("app:open-cart", openListener);
      window.removeEventListener("app:close-cart", closeListener);
    };
  }, []);

  const requireAuth = useCallback(() => {
    if (userId) {
      return true;
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("app:request-login"));
    }
    return false;
  }, [userId]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const fetchCart = useCallback(async () => {
    if (!userId) {
      return;
    }
    setIsLoading(true);
    setLastError("");
    try {
      const response = await fetch(`/api/cart?userId=${userId}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to load cart");
      }
      const payload = await response.json();
      setCart(payload?.cart || emptyCart);
    } catch (error) {
      console.error("Failed to fetch cart", error);
      setLastError("Unable to load cart");
      setCart(emptyCart);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId, fetchCart]);

  const addItem = useCallback(
    async ({ productId, quantity = 1 }) => {
      if (!productId) {
        return { ok: false, reason: "invalid" };
      }
      if (!requireAuth()) {
        return { ok: false, reason: "auth" };
      }
      setIsLoading(true);
      setLastError("");
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId, quantity }),
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.message || "Unable to add item to cart");
        }
        const payload = await response.json();
        setCart(payload?.cart || emptyCart);
        openCart();
        return { ok: true };
      } catch (error) {
        console.error("Add to cart failed", error);
        setLastError(error.message || "Unable to add item to cart");
        return { ok: false, reason: "error", message: error.message };
      } finally {
        setIsLoading(false);
      }
    },
    [requireAuth, userId, openCart]
  );

  const updateQuantity = useCallback(
    async ({ productId, action, quantity }) => {
      if (!productId) {
        return { ok: false, reason: "invalid" };
      }
      if (!requireAuth()) {
        return { ok: false, reason: "auth" };
      }
      setIsLoading(true);
      setLastError("");
      try {
        const response = await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId, action, quantity }),
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.message || "Unable to update cart");
        }
        const payload = await response.json();
        setCart(payload?.cart || emptyCart);
        if ((payload?.cart?.items || []).length === 0) {
          setIsOpen(false);
        }
        return { ok: true };
      } catch (error) {
        console.error("Cart update failed", error);
        setLastError(error.message || "Unable to update cart");
        return { ok: false, reason: "error", message: error.message };
      } finally {
        setIsLoading(false);
      }
    },
    [requireAuth, userId]
  );

  const contextValue = useMemo(
    () => ({
      cart,
      isOpen,
      isLoading,
      lastError,
      userId,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      refreshCart: fetchCart,
      onUserIdChange: (listener) => {
        if (typeof listener !== "function") return () => {};
        setUserIdListeners((prev) => [...prev, listener]);
        return () => {
          setUserIdListeners((prev) => prev.filter((entry) => entry !== listener));
        };
      },
    }),
    [cart, isOpen, isLoading, lastError, userId, openCart, closeCart, addItem, updateQuantity, fetchCart]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export default CartProvider;
