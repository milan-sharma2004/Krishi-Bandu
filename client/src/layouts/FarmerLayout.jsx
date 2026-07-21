import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  CloudSun,
  TrendingUp,
  Bell,
  Wrench,
  Store,
  Package,
  ClipboardList,
  LifeBuoy,
  MoreHorizontal,
  ChevronDown,
  BarChart3,
} from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWindowWidth } from '../hooks/useWindowWidth.js';

// Ordered by priority: earlier items stay visible longest as the header shrinks.
const NAV_ITEMS = [
  { to: '/farmer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/farmer/seller-dashboard', label: 'Seller Dashboard', icon: BarChart3 },
  { to: '/farmer/products', label: 'My Listings', icon: Package },
  { to: '/farmer/orders', label: 'Orders', icon: ClipboardList },
  { to: '/farmer/crops', label: 'Crops', icon: Sprout },
  { to: '/farmer/market-prices', label: 'Market Prices', icon: TrendingUp },
  { to: '/farmer/weather', label: 'Weather', icon: CloudSun },
  { to: '/farmer/advisories', label: 'Advisories', icon: Bell },
  { to: '/farmer/shops', label: 'Shops', icon: Store },
  { to: '/farmer/services', label: 'Services', icon: Wrench },
  { to: '/farmer/support', label: 'Support', icon: LifeBuoy },
];

// Thresholds are sized conservatively so the pills + logo + avatar never
// overflow the header before the "More" menu kicks in — most laptop screens
// (including MacBook Pro/Air) report a logical width well under their
// physical resolution, so "wide-looking" screens can still be under 1536px.
function visibleCountFor(width) {
  if (width >= 1800) return NAV_ITEMS.length; // 11 — only very wide/external monitors
  if (width >= 1536) return 9;
  if (width >= 1280) return 7;
  if (width >= 1024) return 5;
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
}

export default function FarmerLayout() {
  const { user } = useAuth();
  const width = useWindowWidth();
  const [moreOpen, setMoreOpen] = useState(false);

  const visibleCount = visibleCountFor(width);
  const visibleItems = NAV_ITEMS.slice(0, visibleCount);
  const overflowItems = NAV_ITEMS.slice(visibleCount);

  const pillClass = ({ isActive }) =>
    `flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
      isActive ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1680px] items-center gap-6 px-4 py-3 sm:px-6">
          <Logo />

          <nav className="flex flex-1 items-center gap-1.5">
            {visibleItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={pillClass}>
                <Icon size={15} />
                {label}
              </NavLink>
            ))}

            {overflowItems.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setMoreOpen((o) => !o)}
                  className="flex shrink-0 items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-100"
                >
                  <MoreHorizontal size={15} />
                  More
                  <ChevronDown size={13} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                    <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                      {overflowItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                          key={to}
                          to={to}
                          end={end}
                          onClick={() => setMoreOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                              isActive ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                          }
                        >
                          <Icon size={15} />
                          {label}
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </nav>

          <Link to="/farmer/profile" title={user?.name} className="flex shrink-0 items-center rounded-full hover:opacity-80">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'F'}
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
