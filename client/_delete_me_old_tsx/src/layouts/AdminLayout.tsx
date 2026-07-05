import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Wrench,
  Store,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Sprout,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/shops', label: 'Shops', icon: Store },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/advisories', label: 'Advisories', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-gray-900 md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Sprout size={20} />
          </span>
          <span className="text-lg font-bold text-white">Krishi Bandu</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-800 p-4">
          <div className="mb-3 flex items-center gap-2">
            <img
              src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}`}
              alt={user?.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 md:ml-60">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <span className="text-lg font-bold text-gray-900">Krishi Bandu Admin</span>
          <button onClick={logout} className="text-gray-500">
            <LogOut size={18} />
          </button>
        </header>
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
