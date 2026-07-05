import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export default function Trend({ trend }) {
  if (trend === 'up') return <ArrowUp size={16} className="text-primary-600" />;
  if (trend === 'down') return <ArrowDown size={16} className="text-red-500" />;
  return <Minus size={16} className="text-gray-400" />;
}
