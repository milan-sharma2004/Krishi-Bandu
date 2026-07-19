import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Calendar, Store } from 'lucide-react';
import api, { getErrorMessage } from '../../api/client.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

export default function SellerShop() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api
      .get(`/sellers/${id}`)
      .then((res) => {
        if (active) setData(res.data);
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
  }, [id]);

  if (loading) return <p className="py-10 text-center text-gray-400">Loading shop...</p>;
  if (error) return <p className="rounded-xl border border-red-200 bg-red-50 py-6 text-center text-sm text-red-700">{error}</p>;

  const { seller, products } = data;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start gap-4">
          <img
            src={mediaUrl(seller.avatarUrl) || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name)}`}
            alt={seller.name}
            className="h-16 w-16 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Store size={16} className="text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">{seller.shopName || `${seller.name}'s Shop`}</h1>
            </div>
            {seller.shopName && <p className="mt-0.5 text-sm text-gray-500">by {seller.name}</p>}
            {seller.shopDescription && <p className="mt-2 text-sm text-gray-600">{seller.shopDescription}</p>}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
              {seller.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-gray-400" /> {seller.location}
                </span>
              )}
              {seller.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={14} className="text-gray-400" /> {seller.phone}
                </span>
              )}
              {seller.memberSince && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-400" /> Selling since {new Date(seller.memberSince).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-gray-500">{products.length} product{products.length === 1 ? '' : 's'} available</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <Link key={p._id} to={`/buyer/products/${p._id}`} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md">
              <img src={mediaUrl(p.imageUrl) || 'https://placehold.co/200x140?text=%20'} alt={p.name} className="mb-2 h-28 w-full rounded-lg object-cover" />
              <p className="truncate text-sm font-semibold text-gray-900">
                {p.name} {p.variety && <span className="font-normal text-gray-500">({p.variety})</span>}
              </p>
              <p className="text-xs text-gray-500">{p.location}</p>
              <p className="mt-1 text-sm font-bold text-primary-700">Rs {p.pricePerKg}/kg</p>
            </Link>
          ))}
          {products.length === 0 && (
            <p className="col-span-full py-10 text-center text-gray-400">This shop has no active listings right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}
