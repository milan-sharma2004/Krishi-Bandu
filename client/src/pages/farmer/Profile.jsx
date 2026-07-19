import { Link } from 'react-router-dom';
import { LogOut, Mail, Phone, MapPin, Store, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-2xl font-semibold text-white">
          {user?.name?.charAt(0)?.toUpperCase() || 'F'}
        </span>
        <h1 className="mt-3 text-xl font-bold text-gray-900">{user?.name}</h1>
        <p className="text-sm capitalize text-gray-500">{user?.role}</p>
      </div>

      <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Mail size={16} className="text-gray-400" /> {user?.email}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Phone size={16} className="text-gray-400" /> {user?.phone || 'Not provided'}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <MapPin size={16} className="text-gray-400" /> {user?.location || 'Not provided'}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Store size={16} className="text-primary-600" />
          {user?.shopName || 'Shop not set up yet'}
        </div>
        {user?.shopDescription && <p className="mt-1 text-sm text-gray-600">{user.shopDescription}</p>}
        <Link
          to="/farmer/products"
          className="mt-3 flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
        >
          Manage shop &amp; products <ArrowRight size={14} />
        </Link>
      </div>

      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
      >
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}
