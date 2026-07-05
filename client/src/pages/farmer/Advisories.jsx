import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CloudRain, Bug, Leaf, Info } from 'lucide-react';
import api from '../../api/client.js';

const ICON = { weather: CloudRain, pest: Bug, fertilizer: Leaf, subsidy: Info, general: Info };
const SEVERITY_STYLE = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-primary-50 text-primary-700 border-primary-200',
};
const TYPES = ['All', 'weather', 'pest', 'fertilizer', 'subsidy'];

export default function Advisories() {
  const [advisories, setAdvisories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeType = searchParams.get('type') || 'All';

  useEffect(() => {
    api.get('/advisories').then((res) => setAdvisories(res.data));
  }, []);

  function setType(type) {
    if (type === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ type });
    }
  }

  const filtered = activeType === 'All' ? advisories : advisories.filter((a) => a.type === activeType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Advisories</h1>
        <p className="text-sm text-gray-500">Weather, pest, fertilizer, and subsidy alerts for your region.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setType(type)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              activeType === type ? 'bg-primary-600 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((a) => {
          const Icon = ICON[a.type] || Info;
          return (
            <div key={a._id} className={`flex items-start gap-3 rounded-xl border p-4 shadow-sm ${SEVERITY_STYLE[a.severity]}`}>
              <Icon size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">{a.message}</p>
                <p className="mt-1 text-xs opacity-70">
                  {a.region} · {a.type} · {a.severity} priority
                </p>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-400 shadow-sm">
            No advisories at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
