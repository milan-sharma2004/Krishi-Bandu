import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CloudSun, Sprout, Package, TrendingUp, Bug, MessageCircle, ChevronDown } from 'lucide-react';
import api from '../../api/client.js';

const SUPPORT_LINKS = [
  { label: 'Weather Update', icon: CloudSun, desc: 'Check forecasts before field work', to: '/farmer/weather' },
  { label: 'What to Farm (Seasonal)', icon: Sprout, desc: 'Season-suitable crop suggestions', to: '/farmer' },
  { label: 'Input Guidance (Fertilizer)', icon: Package, desc: 'Dosage & application schedule', to: '/farmer/advisories?type=fertilizer' },
  { label: 'Pest & Disease Advisories', icon: Bug, desc: 'Identify and treat common issues', to: '/farmer/advisories?type=pest' },
  { label: 'Market Prices (Graphs)', icon: TrendingUp, desc: 'Track price trends over time', to: '/farmer/market-prices' },
];

const CROP_CARE_STAGES = [
  { stage: 'Land Preparation', tip: 'Plough 2–3 times and level the field; incorporate well-rotted farmyard manure before sowing.' },
  { stage: 'Sowing / Transplanting', tip: 'Use certified seed, treat with fungicide, and maintain recommended row spacing for airflow.' },
  { stage: 'Vegetative Growth', tip: 'Apply split doses of nitrogen, weed at 20–25 days, and irrigate at critical growth stages.' },
  { stage: 'Flowering / Fruiting', tip: 'Watch for pest buildup, apply potassium for better grain/fruit fill, avoid water stress.' },
  { stage: 'Harvest & Storage', tip: 'Harvest at proper maturity, dry to safe moisture content, and store in clean, ventilated conditions.' },
];

export default function Support() {
  const [orders, setOrders] = useState([]);
  const [showCropCare, setShowCropCare] = useState(false);

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
        {SUPPORT_LINKS.map(({ label, icon: Icon, desc, to }) => (
          <Link key={label} to={to} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-300 hover:shadow-md">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
              <Icon size={20} />
            </span>
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            <p className="mt-1 text-xs text-gray-500">{desc}</p>
          </Link>
        ))}

        <button
          onClick={() => setShowCropCare((s) => !s)}
          className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-primary-300 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
            <Sprout size={20} />
          </span>
          <p className="flex items-center justify-between text-sm font-semibold text-gray-900">
            Crop Care Guidelines
            <ChevronDown size={16} className={`transition-transform ${showCropCare ? 'rotate-180' : ''}`} />
          </p>
          <p className="mt-1 text-xs text-gray-500">Best practices by crop stage</p>
        </button>
      </div>

      {showCropCare && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-500">Crop Care Guidelines — by Stage</p>
          <ol className="space-y-3">
            {CROP_CARE_STAGES.map(({ stage, tip }, i) => (
              <li key={stage} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{stage}</p>
                  <p className="text-gray-600">{tip}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

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
