import { useEffect, useState } from 'react';
import { CloudSun, Sprout, Package, TrendingUp, Bug, MessageCircle } from 'lucide-react';
import api from '../../api/client.js';

const SUPPORT_LINKS = [
  { label: 'Weather Update', icon: CloudSun, desc: 'Check forecasts before field work' },
  { label: 'What to Farm (Seasonal)', icon: Sprout, desc: 'Season-suitable crop suggestions' },
  { label: 'Input Guidance (Fertilizer)', icon: Package, desc: 'Dosage & application schedule' },
  { label: 'Pest & Disease Advisories', icon: Bug, desc: 'Identify and treat common issues' },
  { label: 'Crop Care Guidelines', icon: Sprout, desc: 'Best practices by crop stage' },
  { label: 'Market Prices (Graphs)', icon: TrendingUp, desc: 'Track price trends over time' },
];

export default function Support() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/selling').then((res) => setOrders(res.data.slice(0, 5)));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Farm Support</h1>
        <p className="text-sm text-gray-500">Guidance, advisories, and your recent buyer orders.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPORT_LINKS.map(({ label, icon: Icon, desc }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
              <Icon size={20} />
            </span>
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            <p className="mt-1 text-xs text-gray-500">{desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-gray-500">Recent Orders From Buyers</p>
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o._id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-gray-800">Order #{o.orderCode}</p>
                <p className="text-xs text-gray-500">{o.buyer?.name} · {o.deliveryAddress}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">Rs {o.totalAmount}</p>
                <p className="text-xs text-gray-500">{o.status}</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="py-6 text-center text-sm text-gray-400">No orders yet.</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-800">
        <MessageCircle size={18} />
        Need direct help? Call our farmer helpline at <span className="font-semibold">1660-01-2323</span> (toll-free).
      </div>
    </div>
  );
}
