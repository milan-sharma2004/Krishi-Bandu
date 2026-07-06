const WEATHER_CODE_LABEL = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
};

function describeCode(code) {
  return WEATHER_CODE_LABEL[code] || 'Unknown';
}

const geocodeCache = new Map();

async function geocode(location) {
  const key = location.trim().toLowerCase();
  if (geocodeCache.has(key)) return geocodeCache.get(key);

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding request failed');
  const data = await res.json();
  const match = data.results?.[0];
  if (!match) return null;

  const result = { latitude: match.latitude, longitude: match.longitude, resolvedName: match.name };
  geocodeCache.set(key, result);
  return result;
}

export async function getWeatherForLocation(location) {
  const fallback = { latitude: 27.7172, longitude: 85.324, resolvedName: 'Kathmandu' };
  const place = (location && (await geocode(location))) || fallback;

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
    '&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m' +
    '&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max' +
    '&timezone=auto&forecast_days=7';

  const res = await fetch(url);
  if (!res.ok) throw new Error('Forecast request failed');
  const data = await res.json();

  const today = {
    temp: Math.round(data.current.temperature_2m),
    condition: describeCode(data.current.weather_code),
    windKph: Math.round(data.current.wind_speed_10m),
    humidity: Math.round(data.current.relative_humidity_2m),
  };

  const daily = data.daily.time.map((date, i) => ({
    date,
    high: Math.round(data.daily.temperature_2m_max[i]),
    low: Math.round(data.daily.temperature_2m_min[i]),
    condition: describeCode(data.daily.weather_code[i]),
    weatherCode: data.daily.weather_code[i],
    rainChance: data.daily.precipitation_probability_max[i],
  }));

  return { location: place.resolvedName, today, daily, upcoming: daily.slice(1, 4) };
}
