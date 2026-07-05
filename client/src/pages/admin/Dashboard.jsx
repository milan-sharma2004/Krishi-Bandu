import { useEffect, useState } from 'react';
import { Users, Sprout, ShoppingBag, ClipboardList } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../api/client.js';
import StatCard from '../../components/StatCard.jsx';

export default function Dashboard() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    api.get('/admin/overview').then((res) => setOverview(res.data));
  }, []);

  if (!overview) return <p className="py-10 text-center text-gray-400">Loading overview...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">System-wide overview of Krishi Bandu.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={overview.totalUsers} icon={Users} accent="primary" />
        <StatCard label="Total Sellers" value={overview.totalSellers} icon={Sprout} accent="blue" />
        <StatCard label="Total Buyers" value={overview.totalBuyers} icon={ShoppingBag} accent="purple" />
        <StatCard label="Total Orders" value={overview.totalOrders} icon={ClipboardList} accent="orange" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-gray-500">Orders (Last 30 Days)</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={overview.ordersLast30Days}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              tick={{ fontSize: 11 }}
              interval={4}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip labelFormatter={(d) => new Date(d).toLocaleDateString()} />
            <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
