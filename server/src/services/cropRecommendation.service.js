const SEASON_BY_MONTH = [
  { season: 'Rabi (Winter)', crops: ['Wheat', 'Potato', 'Mustard', 'Lentil'] }, // Jan
  { season: 'Rabi (Winter)', crops: ['Wheat', 'Potato', 'Mustard', 'Pea'] }, // Feb
  { season: 'Spring', crops: ['Spring Maize', 'Potato', 'Vegetables', 'Groundnut'] }, // Mar
  { season: 'Spring', crops: ['Spring Maize', 'Vegetables', 'Sugarcane'] }, // Apr
  { season: 'Pre-Monsoon', crops: ['Paddy (Nursery)', 'Maize', 'Vegetables'] }, // May
  { season: 'Kharif (Monsoon)', crops: ['Paddy', 'Maize', 'Millet'] }, // Jun
  { season: 'Kharif (Monsoon)', crops: ['Paddy', 'Maize', 'Millet', 'Soybean'] }, // Jul
  { season: 'Kharif (Monsoon)', crops: ['Paddy', 'Maize', 'Cauliflower (Early)'] }, // Aug
  { season: 'Late Kharif', crops: ['Paddy', 'Cauliflower', 'Tomato'] }, // Sep
  { season: 'Rabi Sowing', crops: ['Wheat', 'Mustard', 'Potato', 'Cauliflower'] }, // Oct
  { season: 'Rabi Sowing', crops: ['Wheat', 'Mustard', 'Potato', 'Lentil'] }, // Nov
  { season: 'Rabi (Winter)', crops: ['Wheat', 'Potato', 'Mustard'] }, // Dec
];

export function getSeasonalRecommendations(date = new Date()) {
  const { season, crops } = SEASON_BY_MONTH[date.getMonth()];
  return { season, crops };
}
