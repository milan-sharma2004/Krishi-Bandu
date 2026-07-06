import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Receipt,
  TrendingUp,
  AlertTriangle,
  Wrench,
  HelpCircle,
  CloudRain,
  Bug,
  Leaf,
  Info,
  CheckCircle2,
} from 'lucide-react';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useWeather } from '../../hooks/useWeather.js';
import { weatherIconFor } from '../../utils/weatherIcon.js';
import Trend from '../../components/Trend.jsx';

const ADVISORY_ICON = {
  weather: CloudRain,
  pest: Bug,
  fertilizer: Leaf,
  subsidy: Info,
  general: Info,
};

const QUICK_ACTIONS = [
  { label: 'Add New Crop', icon: Plus, to: '/farmer/crops' },
  { label: 'Add Expense', icon: Receipt, to: '/farmer/crops' },
  { label: 'View Market Prices', icon: TrendingUp, to: '/farmer/market-prices' },
  { label: 'Pest Alert', icon: AlertTriangle, to: '/farmer/advisories' },
  { label: 'Advisories', icon: Info, to: '/farmer/advisories' },
  { label: 'Local Services', icon: Wrench, to: '/farmer/services' },
  { label: 'Help / Support', icon: HelpCircle, to: '/farmer/support' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const { weather } = useWeather(user?.location);

  useEffect(() => {
    api.get('/crop-records/mine').then((res) => setRecords(res.data));
    api.get('/advisories').then((res) => setAdvisories(res.data));
    api.get('/recommendations').then((res) => setRecommendation(res.data));
  }, []);

  const outbreakAlerts = advisories.filter((a) => a.type === 'pest' && a.severity === 'high');
  const TodayIcon = weather ? weatherIconFor(weather.daily?.[0]?.weatherCode) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-sm text-gray-500">Here's what's happening on your farm today.</p>
      </div>

      {outbreakAlerts.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-2">
            <Bug size={18} className="mt-0.5 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-800">Disease / Pest Outbreak Alert</p>
              <ul className="mt-1 space-y-0.5 text-sm text-red-700">
                {outbreakAlerts.map((a) => (
                  <li key={a._id}>
                    {a.message} — {a.region}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <p className="mb-3 text-sm font-semibold text-gray-500">Weather Update — Today</p>
          {weather ? (
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                {TodayIcon && <TodayIcon size={40} className="text-orange-400" />}
                <div>
                  <p className="text-3xl font-bold text-gray-900">{weather.today.temp}°C</p>
                  <p className="text-sm text-gray-500">
                    {weather.today.condition} · Wind: {weather.today.windKph} km/h
                  </p>
                </div>
              </div>
              <div className="ml-auto flex gap-6 border-l border-gray-100 pl-6">
                {weather.upcoming.map((f, i) => {
                  const Icon = weatherIconFor(f.weatherCode);
                  return (
                    <div key={f.date} className="text-center">
                      <p className="mb-1 text-xs font-medium text-gray-500">
                        {i === 0 ? 'Tomorrow' : new Date(f.date).toLocaleDateString(undefined, { weekday: 'short' })}
                      </p>
                      <Icon size={20} className="mx-auto mb-1 text-orange-300" />
                      <p className="text-sm font-semibold text-gray-800">
                        {f.high}° / {f.low}°
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Loading live weather...</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-gray-500">Recommended for You</p>
          {recommendation && <p className="mb-3 text-xs text-gray-400">{recommendation.season} season</p>}
          <ul className="space-y-2">
            {(recommendation?.crops || []).map((crop) => (
              <li key={crop} className="flex items-center justify-between text-sm text-gray-700">
                {crop}
                <span className="flex items-center gap-1 text-xs font-medium text-primary-600">
                  <CheckCircle2 size={14} /> Suitable
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/farmer/crops"
            className="mt-3 block rounded-lg bg-primary-600 py-2 text-center text-sm font-semibold text-white hover:bg-primary-700"
          >
            View Details
          </Link>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-gray-500">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
            >
              <Icon size={15} /> {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">Recent Crop Records (Rs./kg)</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400">
                <th className="pb-2 font-medium">Crop</th>
                <th className="pb-2 font-medium">Variety</th>
                <th className="pb-2 font-medium">Area (Ropani)</th>
                <th className="pb-2 font-medium">Production (kg)</th>
                <th className="pb-2 font-medium">Avg. Price</th>
                <th className="pb-2 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-t border-gray-100">
                  <td className="py-2 font-medium text-gray-800">{r.crop}</td>
                  <td className="py-2 text-gray-600">{r.variety}</td>
                  <td className="py-2 text-gray-600">{r.areaRopani}</td>
                  <td className="py-2 text-gray-600">{r.productionKg}</td>
                  <td className="py-2 text-gray-600">{r.avgPrice}</td>
                  <td className="py-2">
                    <Trend trend={r.trend} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/farmer/crops" className="mt-3 inline-block text-sm font-medium text-primary-600 hover:underline">
            View All Records →
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-500">Alerts &amp; Advisories</p>
          <ul className="space-y-3">
            {advisories.map((a) => {
              const Icon = ADVISORY_ICON[a.type] || Info;
              return (
                <li key={a._id} className="flex items-start gap-2 text-sm text-gray-700">
                  <Icon size={16} className="mt-0.5 shrink-0 text-primary-600" />
                  {a.message}
                </li>
              );
            })}
          </ul>
          <Link to="/farmer/advisories" className="mt-3 inline-block text-sm font-medium text-primary-600 hover:underline">
            View All Advisories →
          </Link>
        </div>
      </div>
    </div>
  );
}
