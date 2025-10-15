'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';
import CustomerInfoForm from '@/components/checkout/CustomerInfoForm';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80';

const CheckoutPage = () => {
  const { cart, isLoading } = useCart();
  const router = useRouter();

  const subtotal = useMemo(() => cart.total || 0, [cart.total]);
  const totalItems = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items]
  );

  const formattedSubtotal = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(subtotal),
    [subtotal]
  );

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleBuyNow = () => {
    if (cart.items.length === 0) {
      return;
    }
    // Placeholder for payment integration hook.
    router.push('/checkout/payment');
  };

  const emptyState = cart.items.length === 0;

  return (
    <section className="bg-[#f7f3ec] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600">Secure Checkout</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">Review Your Order</h1>
            <p className="mt-2 text-sm text-gray-500">
              {emptyState
                ? 'Your cart is empty. Add a few handcrafted pieces to continue.'
                : `You have ${totalItems} item${totalItems === 1 ? '' : 's'} ready for checkout.`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleContinueShopping}
            className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:border-amber-600 hover:text-amber-600"
          >
            Continue Shopping
          </button>
        </div>

        {emptyState ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
            <p className="text-sm text-gray-500">
              Nothing to review yet. Explore the collection and add items to your cart.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              {cart.items.map((item) => {
                const lineTotal = (item.price || 0) * item.quantity;
                const formattedLineTotal = new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(lineTotal);

                return (
                  <div
                    key={item.productId}
                    className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row"
                  >
                    <div className="flex w-full max-w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.name}
                        className="aspect-square h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gray-400">
                          Quantity · {item.quantity}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          Carefully curated artisan lighting to elevate your space.
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-semibold text-amber-600 transition hover:text-amber-700"
                        >
                          View details
                        </Link>
                        <span className="text-base font-semibold text-gray-900">{formattedLineTotal}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="space-y-6">
              <CustomerInfoForm />
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                <dl className="mt-6 space-y-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold text-gray-900">{formattedSubtotal}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>Shipping</dt>
                    <dd>Calculated at next step</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>Taxes</dt>
                    <dd>Applied during payment</dd>
                  </div>
                </dl>
                <div className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
                  Secure checkout is handled on the next screen. Review your address and complete payment there.
                </div>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isLoading}
                  className="mt-6 w-full rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300"
                >
                  Buy Now · {formattedSubtotal}
                </button>
                <p className="mt-3 text-[11px] text-gray-400">
                  You will be redirected to our secure payment partner to finalize this order.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};

export default CheckoutPage;
