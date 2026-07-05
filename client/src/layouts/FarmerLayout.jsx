import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  CloudSun,
  TrendingUp,
  Bell,
  Wrench,
  Store,
  Package,
  LifeBuoy,
  LogOut,
} from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/farmer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/farmer/crops', label: 'Crops', icon: Sprout },
  { to: '/farmer/weather', label: 'Weather', icon: CloudSun },
  { to: '/farmer/market-prices', label: 'Market Prices', icon: TrendingUp },
  { to: '/farmer/advisories', label: 'Advisories', icon: Bell },
  { to: '/farmer/services', label: 'Services', icon: Wrench },
  { to: '/farmer/shops', label: 'Shops', icon: Store },
  { to: '/farmer/products', label: 'My Products', icon: Package },
  { to: '/farmer/support', label: 'Support', icon: LifeBuoy },
];

export default function FarmerLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="hide-scrollbar flex flex-1 items-center gap-0.5 overflow-x-auto px-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-medium transition-colors ${
                    isActive ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.location}</p>
            </div>
            <img
              src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}`}
              alt={user?.name}
              className="h-9 w-9 rounded-full object-cover"
            />
            <button
              onClick={logout}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
