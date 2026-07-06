import { Wind, Droplets } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useWeather } from '../../hooks/useWeather.js';
import { weatherIconFor } from '../../utils/weatherIcon.js';

function dayLabel(dateStr, index) {
  if (index === 0) return 'Today';
  return new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short' });
}

export default function Weather() {
  const { user } = useAuth();
  const { weather, error, loading } = useWeather(user?.location);

  if (loading) return <p className="py-10 text-center text-gray-400">Loading live weather...</p>;
  if (error || !weather) return <p className="py-10 text-center text-gray-400">{error || 'Weather unavailable.'}</p>;

  const TodayIcon = weatherIconFor(weather.daily[0]?.weatherCode);
  const highRainDay = weather.daily.find((d) => d.rainChance >= 50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weather</h1>
        <p className="text-sm text-gray-500">{weather.location} · Live from Open-Meteo</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Today, {weather.today.condition}</p>
            <p className="text-5xl font-bold">{weather.today.temp}°C</p>
          </div>
          <TodayIcon size={64} className="opacity-90" />
        </div>
        <div className="mt-6 flex gap-8">
          <div className="flex items-center gap-2 text-sm">
            <Wind size={16} /> Wind: {weather.today.windKph} km/h
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Droplets size={16} /> Humidity: {weather.today.humidity}%
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-gray-500">7-Day Forecast</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {weather.daily.map((d, i) => {
            const Icon = weatherIconFor(d.weatherCode);
            return (
              <div key={d.date} className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                <p className="mb-2 text-xs font-semibold text-gray-500">{dayLabel(d.date, i)}</p>
                <Icon size={28} className="mx-auto mb-2 text-orange-400" />
                <p className="text-sm font-bold text-gray-900">
                  {d.high}° / {d.low}°
                </p>
                <p className="mt-1 text-xs text-blue-500">{d.rainChance}% rain</p>
              </div>
            );
          })}
        </div>
      </div>

      {highRainDay && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Heavy rain expected on {dayLabel(highRainDay.date, weather.daily.indexOf(highRainDay))} (
          {highRainDay.rainChance}% chance). Secure harvested crops and check drainage in low-lying fields.
        </div>
      )}
    </div>
  );
}
