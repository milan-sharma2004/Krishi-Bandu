import { LogOut, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <img
          src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}`}
          alt={user?.name}
          className="mx-auto h-20 w-20 rounded-full object-cover"
        />
        <h1 className="mt-3 text-xl font-bold text-gray-900">{user?.name}</h1>
        <p className="text-sm capitalize text-gray-500">{user?.role} / Consumer</p>
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

      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
      >
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}
