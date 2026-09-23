import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, ChevronRight, Laptop as LaptopIcon } from 'lucide-react';
import client from '../api/client';

const CATEGORIES = ['all', 'gaming', 'office', 'ultrabook', 'workstation', 'everyday'];

export default function LaptopsTab({ onSelectLaptop }) {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [brand, setBrand] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRam, setMinRam] = useState('');
  const [minStorage, setMinStorage] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    client
      .get('/api/laptops')
      .then((res) => setLaptops(res.data || []))
      .catch(() => setLaptops([]))
      .finally(() => setLoading(false));
  }, []);

  const brands = useMemo(() => {
    const set = new Set(laptops.map((l) => l.brand).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [laptops]);

  const filtered = useMemo(() => {
    let result = laptops.filter((l) => {
      const spec = l.Specification || {};
      const q = search.toLowerCase();
      const text = `${l.brand} ${l.model}`.toLowerCase();
      if (search && !text.includes(q)) return false;
      if (category !== 'all' && l.category !== category) return false;
      if (brand !== 'all' && l.brand !== brand) return false;
      if (minPrice && (spec.price_pkr || 0) < Number(minPrice)) return false;
      if (maxPrice && (spec.price_pkr || 0) > Number(maxPrice)) return false;
      if (minRam && (spec.ram_gb || 0) < Number(minRam)) return false;
      if (minStorage && (spec.storage_gb || 0) < Number(minStorage)) return false;
      return true;
    });

    // Sorting
    if (sortBy === 'price_low') {
      result.sort(
        (a, b) => (a.Specification?.price_pkr || 0) - (b.Specification?.price_pkr || 0)
      );
    } else if (sortBy === 'price_high') {
      result.sort(
        (a, b) => (b.Specification?.price_pkr || 0) - (a.Specification?.price_pkr || 0)
      );
    } else if (sortBy === 'cpu') {
      result.sort(
        (a, b) => (b.Specification?.cpu_benchmark || 0) - (a.Specification?.cpu_benchmark || 0)
      );
    } else if (sortBy === 'gpu') {
      result.sort(
        (a, b) => (b.Specification?.gpu_benchmark || 0) - (a.Specification?.gpu_benchmark || 0)
      );
    }

    return result;
  }, [laptops, search, category, brand, minPrice, maxPrice, minRam, minStorage, sortBy]);

  const activeFiltersCount = [
    category !== 'all',
    brand !== 'all',
    minPrice !== '',
    maxPrice !== '',
    minRam !== '',
    minStorage !== '',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setCategory('all');
    setBrand('all');
    setMinPrice('');
    setMaxPrice('');
    setMinRam('');
    setMinStorage('');
    setSortBy('relevance');
  };

  return (
    <div>
      {/* Search + sort bar */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by brand or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="relevance">Sort: Relevance</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="cpu">Best CPU</option>
          <option value="gpu">Best GPU</option>
        </select>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
            showFilters || activeFiltersCount > 0
              ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Filter Laptops</h3>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Min RAM (GB)
              </label>
              <input
                type="number"
                value={minRam}
                onChange={(e) => setMinRam(e.target.value)}
                placeholder="e.g., 16"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Min Storage (GB)
              </label>
              <input
                type="number"
                value={minStorage}
                onChange={(e) => setMinStorage(e.target.value)}
                placeholder="e.g., 512"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Min Price (PKR)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Max Price (PKR)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="1000000"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results info */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? 'Loading...' : `${filtered.length} laptops found`}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="text-sm text-gray-500">Loading catalog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
          <LaptopIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-sm font-semibold text-gray-900">No laptops match your filters</p>
          <p className="mt-1 text-xs text-gray-500">Try adjusting the filters above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((laptop) => {
            const spec = laptop.Specification || {};
            return (
              <button
                key={laptop.id}
                onClick={() => onSelectLaptop(laptop)}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {laptop.brand}
                </div>
                <h3 className="mb-3 font-bold text-gray-900">{laptop.model}</h3>
                <div className="mb-4 text-xl font-extrabold text-indigo-600">
                  Rs. {(spec.price_pkr || 0).toLocaleString()}
                </div>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                    {spec.cpu_model?.substring(0, 20) || 'CPU'}
                  </span>
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                    {spec.ram_gb || 8}GB
                  </span>
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                    {spec.storage_gb || 256}GB
                  </span>
                </div>
                <div className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                  View details
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
