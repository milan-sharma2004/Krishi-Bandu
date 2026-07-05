import { CloudSun, CloudRain, Wind, Droplets, Sun } from 'lucide-react';

const WEEK = [
  { day: 'Today', icon: CloudSun, high: 28, low: 19, rain: 10 },
  { day: 'Tomorrow', icon: CloudSun, high: 31, low: 19, rain: 5 },
  { day: 'Day After', icon: Sun, high: 29, low: 18, rain: 0 },
  { day: 'Thu', icon: CloudRain, high: 26, low: 18, rain: 60 },
  { day: 'Fri', icon: CloudRain, high: 25, low: 17, rain: 70 },
  { day: 'Sat', icon: CloudSun, high: 27, low: 18, rain: 20 },
  { day: 'Sun', icon: Sun, high: 30, low: 19, rain: 0 },
];

export default function Weather() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weather</h1>
        <p className="text-sm text-gray-500">Sindhupalchok · Updated just now</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Today, Partly Cloudy</p>
            <p className="text-5xl font-bold">28°C</p>
          </div>
          <CloudSun size={64} className="opacity-90" />
        </div>
        <div className="mt-6 flex gap-8">
          <div className="flex items-center gap-2 text-sm">
            <Wind size={16} /> Wind: 8 km/h
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Droplets size={16} /> Humidity: 64%
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-gray-500">7-Day Forecast</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {WEEK.map(({ day, icon: Icon, high, low, rain }) => (
            <div key={day} className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <p className="mb-2 text-xs font-semibold text-gray-500">{day}</p>
              <Icon size={28} className="mx-auto mb-2 text-orange-400" />
              <p className="text-sm font-bold text-gray-900">
                {high}° / {low}°
              </p>
              <p className="mt-1 text-xs text-blue-500">{rain}% rain</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Heavy rain expected on Thursday and Friday. Secure harvested crops and check drainage in low-lying fields.
      </div>
    </div>
  );
}
