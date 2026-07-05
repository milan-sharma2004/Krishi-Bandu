import { useEffect, useState } from 'react';
import { Store, MapPin } from 'lucide-react';
import api from '../../api/client.js';

export default function Shops() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    api.get('/shops').then((res) => setShops(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nearby Agri Shops</h1>
        <p className="text-sm text-gray-500">Seeds, fertilizers, tools, and organic inputs near you.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((s) => (
          <div key={s._id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <Store size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={12} /> {s.location} · {s.distanceKm} km
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {s.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
