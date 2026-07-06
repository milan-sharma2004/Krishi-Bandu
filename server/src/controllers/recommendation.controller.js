import { getSeasonalRecommendations } from '../services/cropRecommendation.service.js';

export function getRecommendations(_req, res) {
  res.json(getSeasonalRecommendations());
}
