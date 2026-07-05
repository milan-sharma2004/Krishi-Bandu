import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../api/client.js';
import StatCard from '../../components/StatCard.jsx';
import { Package, ClipboardList, TrendingUp } from 'lucide-react';

export default function Reports() {
  const [overview, setOverview] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/admin/overview').then((res) => setOverview(res.data));
    api.get('/products').then((res) => setProducts(res.data));
  }, []);

  if (!overview) return <p className="py-10 text-center text-gray-400">Loading reports...</p>;

  const priceByProduct = products.map((p) => ({ name: p.name, price: p.pricePerKg }));
  const avgOrderValue = overview.totalOrders
    ? Math.round((overview.ordersLast30Days.reduce((s, d) => s + d.count, 0) / overview.totalOrders) * 100) / 100
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">Marketplace performance summary.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active Listings" value={overview.totalProducts} icon={Package} accent="primary" />
        <StatCard label="Total Orders" value={overview.totalOrders} icon={ClipboardList} accent="blue" />
        <StatCard label="Orders in Last 30 Days" value={overview.ordersLast30Days.reduce((s, d) => s + d.count, 0)} icon={TrendingUp} accent="orange" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-gray-500">Price by Product (Rs./kg)</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={priceByProduct}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="price" fill="#16a34a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-400">Average daily orders (30d window): {avgOrderValue}</p>
    </div>
  );
}
