import { Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo({ dark = false }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
        <Sprout size={20} />
      </span>
      <span className={`text-lg font-bold leading-none ${dark ? 'text-white' : 'text-gray-900'}`}>
        Krishi Bandu
      </span>
    </Link>
  );
}
