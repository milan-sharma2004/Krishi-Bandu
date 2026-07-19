import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import api, { getErrorMessage } from '../../api/client.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const CATEGORIES = ['All', 'Crops', 'Seeds', 'Organic', 'Tools'];

export default function Browse() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const params = {};
    if (category !== 'All') params.category = category;
    if (search) params.search = search;

    setLoading(true);
    setError('');
    api
      .get('/products', { params })
      .then((res) => {
        if (active) setProducts(res.data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Products</h1>
        <p className="text-sm text-gray-500">Fresh crops, seeds, organic inputs, and tools from local farmers.</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-full border border-gray-300 py-2.5 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${
              category === c ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <p className="py-10 text-center text-gray-400">Loading products...</p>}

      {!loading && error && (
        <p className="rounded-xl border border-red-200 bg-red-50 py-6 text-center text-sm text-red-700">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <Link key={p._id} to={`/buyer/products/${p._id}`} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md">
              <img src={mediaUrl(p.imageUrl) || 'https://placehold.co/200x140?text=%20'} alt={p.name} className="mb-2 h-28 w-full rounded-lg object-cover" />
              <p className="truncate text-sm font-semibold text-gray-900">
                {p.name} {p.variety && <span className="font-normal text-gray-500">({p.variety})</span>}
              </p>
              <p className="text-xs text-gray-500">{p.seller?.location}</p>
              <p className="mt-1 text-sm font-bold text-primary-700">Rs {p.pricePerKg}/kg</p>
            </Link>
          ))}
          {products.length === 0 && (
            <p className="col-span-full py-10 text-center text-gray-400">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
