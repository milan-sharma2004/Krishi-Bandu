import { useEffect, useState } from 'react';
import { Tractor, UserCog, Stethoscope, HeartPulse, Phone } from 'lucide-react';
import api from '../../api/client.js';

const ICON = {
  'Tractor Service': Tractor,
  'Agricultural Officer': UserCog,
  'Veterinary Doctor': Stethoscope,
  'Private Practitioner': HeartPulse,
};

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then((res) => setServices(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Local Services</h1>
        <p className="text-sm text-gray-500">Tractors, labor, irrigation, veterinary and more — near you.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const Icon = ICON[s.category] || Tractor;
          return (
            <div key={s._id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{s.category}</p>
                  <p className="text-xs text-gray-500">{s.location}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{s.provider}</p>
              <a href={`tel:${s.contact}`} className="mt-3 flex items-center gap-2 text-sm font-medium text-primary-600 hover:underline">
                <Phone size={14} /> {s.contact}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
