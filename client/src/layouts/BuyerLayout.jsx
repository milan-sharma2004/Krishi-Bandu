import { NavLink, Outlet, Link } from 'react-router-dom';
import { Home, Search, ClipboardList, User, ShoppingCart } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

// Used for the mobile bottom tab bar. The desktop header nav drops "Profile"
// since the avatar in the header already links there.
const NAV_ITEMS = [
  { to: '/buyer', label: 'Home', icon: Home, end: true },
  { to: '/buyer/browse', label: 'Browse', icon: Search },
  { to: '/buyer/orders', label: 'Orders', icon: ClipboardList },
  { to: '/buyer/profile', label: 'Profile', icon: User },
];

const DESKTOP_NAV_ITEMS = NAV_ITEMS.filter((item) => item.to !== '/buyer/profile');

export default function BuyerLayout() {
  const { user } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1680px] items-center gap-6 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="hidden flex-1 items-center gap-1.5 md:flex">
            {DESKTOP_NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-3 md:ml-auto">
            <NavLink to="/buyer/cart" className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <Link to="/buyer/profile" title={user?.name} className="hidden items-center rounded-full hover:opacity-80 sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'B'}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-gray-200 bg-white py-2 md:hidden">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium ${
                isActive ? 'text-primary-600' : 'text-gray-400'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
