"use client";
import React, { useEffect, useState } from "react";

const Sidebar = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;

    const fetchCategories = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load categories");
        }
        if (!ignore) {
          setCategories(Array.isArray(data.categories) ? data.categories : []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      ignore = true;
    };
  }, [isOpen]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-80 max-w-sm bg-white/95 backdrop-blur-sm shadow-2xl border-r border-white/40 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-amber-500">Browse</p>
              <h2 className="mt-3 text-2xl font-semibold text-gray-900">Lighting Categories</h2>
              <p className="mt-1 text-sm text-gray-500">Discover handcrafted fixtures curated by our studio.</p>
            </div>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-lg leading-none text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close sidebar"
              onClick={() => {
                onClose?.();
              }}
            >
              ×
            </button>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
              <div className="h-9 w-9 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center text-sm font-medium">%</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Exclusive Trade Program</p>
                <p className="text-xs text-gray-500">Partner perks for hospitality & retail spaces.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-9 w-9 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-sm font-medium">✓</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Complimentary Styling Call</p>
                <p className="text-xs text-gray-500">Book a 15 min session with our lighting experts.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-2xl border border-gray-100 bg-gray-50 px-4 py-5">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="mt-3 h-3 w-48 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-600">
              {error}
            </div>
          )}
          {!loading && !error && categories.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-6 text-sm text-gray-500 text-center">
              No categories found. Add your first lighting collection to get started.
            </div>
          )}
          {!loading && !error && categories.length > 0 && (
            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category._id}>
                  <button
                    type="button"
                    className="group flex w-full items-start justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <div>
                      <p className="text-base font-semibold text-gray-900 group-hover:text-amber-600">
                        {category.name}
                      </p>
                      {category.description && (
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="px-6 pb-8">
          <button
            type="button"
            className="w-full rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-600/30 transition hover:bg-amber-700"
          >
            View Full Catalogue
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
