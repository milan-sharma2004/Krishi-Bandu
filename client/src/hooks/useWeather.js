import { useEffect, useState } from 'react';
import api from '../api/client.js';

export function useWeather(location) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get('/weather', { params: location ? { location } : {} })
      .then((res) => {
        if (!cancelled) setWeather(res.data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load live weather right now.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [location]);

  return { weather, error, loading };
}
