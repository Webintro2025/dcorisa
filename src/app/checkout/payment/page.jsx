'use client';

import React from 'react';
import Link from 'next/link';

const PaymentPlaceholderPage = () => {
  return (
    <section className="bg-[#f0ebe4] py-20">
      <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-amber-200 bg-white px-8 py-16 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">Payment Gateway Coming Soon</h1>
        <p className="mt-4 text-sm text-gray-600">
          This is where you will securely complete your purchase with our payment partner. The integration is
          in progress. Meanwhile, feel free to review your cart or continue exploring the collection.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/checkout"
            className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-amber-600 hover:text-amber-600"
          >
            Back to checkout
          </Link>
          <Link
            href="/"
            className="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentPlaceholderPage;
