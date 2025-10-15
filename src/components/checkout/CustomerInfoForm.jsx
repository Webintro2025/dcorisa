'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';

const FALLBACK_COUNTRY = 'India';

const buildInitialState = (overrides = {}) => ({
  name: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: FALLBACK_COUNTRY,
  isDefault: true,
  ...overrides,
});

const CustomerInfoForm = () => {
  const { userId, onUserIdChange } = useCart();
  const [form, setForm] = useState(() => buildInitialState());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hasAddresses, setHasAddresses] = useState(false);

  const [resolvedUserId, setResolvedUserId] = useState(userId);

  useEffect(() => {
    setResolvedUserId(userId);
  }, [userId]);

  useEffect(() => {
    if (!onUserIdChange) {
      return undefined;
    }
    const unsubscribe = onUserIdChange((nextUserId) => {
      setResolvedUserId(nextUserId);
    });
    return unsubscribe;
  }, [onUserIdChange]);

  const isDisabled = !resolvedUserId || loading || submitting;

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const resetMessages = useCallback(() => {
    setMessage('');
    setError('');
  }, []);

  useEffect(() => {
    if (!resolvedUserId) {
      setForm(buildInitialState());
      setHasAddresses(false);
      return;
    }

    let ignore = false;

    const fetchAddresses = async () => {
      setLoading(true);
      resetMessages();
      try {
  const response = await fetch(`/api/customer-info?userId=${encodeURIComponent(resolvedUserId)}`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || 'Unable to load saved addresses');
        }
        if (ignore) return;
        const entries = Array.isArray(payload?.addresses) ? payload.addresses : [];
        if (entries.length > 0) {
          const defaultEntry = entries.find((entry) => entry.isDefault) || entries[0];
          setForm(
            buildInitialState({
              ...defaultEntry,
              isDefault: Boolean(defaultEntry?.isDefault),
            })
          );
          setHasAddresses(true);
        } else {
          setForm(buildInitialState());
          setHasAddresses(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to load saved addresses');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchAddresses();
    return () => {
      ignore = true;
    };
  }, [resolvedUserId, resetMessages]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!resolvedUserId) {
        setError('Please log in to save your delivery details.');
        return;
      }
      setSubmitting(true);
      resetMessages();
      try {
        const response = await fetch('/api/customer-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            userId: resolvedUserId,
            name: form.name,
            email: form.email,
            phone: form.phone,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
            isDefault: form.isDefault,
          }),
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || 'Unable to save address');
        }
        setMessage('Delivery details saved successfully.');
        setHasAddresses(true);
      } catch (err) {
        setError(err.message || 'Unable to save address');
      } finally {
        setSubmitting(false);
      }
    },
    [form, resolvedUserId, resetMessages]
  );

  const status = useMemo(() => {
    if (loading) {
      return 'Loading your saved address…';
    }
    if (error) {
      return error;
    }
    if (message) {
      return message;
    }
    if (!resolvedUserId) {
      return 'Log in to save your delivery information for faster checkout.';
    }
    return hasAddresses ? 'Update your default delivery address.' : 'Add your delivery details to proceed.';
  }, [loading, error, message, resolvedUserId, hasAddresses]);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Delivery Details</h3>
        {submitting && <Loader2 className="h-4 w-4 animate-spin text-amber-600" />}
      </div>
      <p className="mt-2 text-xs text-gray-500">{status}</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Full Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={isDisabled}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Phone
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              disabled={isDisabled}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
            />
          </label>
        </div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Email (optional)
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={isDisabled}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Address Line 1
          <input
            type="text"
            name="addressLine1"
            value={form.addressLine1}
            onChange={handleChange}
            required
            disabled={isDisabled}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Address Line 2 (optional)
          <input
            type="text"
            name="addressLine2"
            value={form.addressLine2}
            onChange={handleChange}
            disabled={isDisabled}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            City
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              disabled={isDisabled}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            State
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              disabled={isDisabled}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Postal Code
            <input
              type="text"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              required
              disabled={isDisabled}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Country
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              disabled={isDisabled}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
            />
          </label>
        </div>
        <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
            disabled={isDisabled}
            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
          />
          Set as default delivery address
        </label>
        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full rounded-full px-6 py-3 text-sm font-semibold transition ${
            isDisabled ? 'bg-amber-300 text-white' : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          Save Delivery Information
        </button>
      </form>
    </div>
  );
};

export default CustomerInfoForm;
