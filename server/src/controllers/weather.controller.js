import { getWeatherForLocation } from '../services/weather.service.js';

export async function getWeather(req, res) {
  const location = req.query.location || req.user?.location;
  try {
    const weather = await getWeatherForLocation(location);
    res.json(weather);
  } catch {
    res.status(502).json({ message: 'Could not fetch weather right now' });
  }
}
