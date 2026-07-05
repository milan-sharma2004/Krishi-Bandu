import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../api/client.js';

export default function MarketPrices() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data));
  }, []);

  const chartData = products.map((p) => ({ name: p.name, price: p.pricePerKg }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Market Prices</h1>
        <p className="text-sm text-gray-500">Daily prices reported across Krishi Bandu marketplaces.</p>
      </div>

      {chartData.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-gray-500">Current Price by Product (Rs./kg)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="price" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs text-gray-500">
              <th className="px-4 py-3 font-medium">Crop</th>
              <th className="px-4 py-3 font-medium">Variety</th>
              <th className="px-4 py-3 font-medium">Price (Rs./kg)</th>
              <th className="px-4 py-3 font-medium">Available Qty</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Listing</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.variety || '—'}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 font-semibold text-primary-700">
                    <TrendingUp size={14} /> Rs {p.pricePerKg}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.availableQty} kg</td>
                <td className="px-4 py-3 text-gray-600">{p.location || '—'}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">
                    {p.listingType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
