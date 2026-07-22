import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo.jsx';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Log in', to: '/login' },
  { label: 'Get Started', to: '/register' },
];

const LEGAL_LINKS = [{ label: 'Privacy Policy', to: '/privacy-policy' }];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo dark />
          <p className="mt-3 max-w-sm text-sm">
            Krishi Bandu is an integrated AgriTech platform connecting Nepali farmers, buyers, and local
            services — built to make farming smarter and markets easier to reach.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-200">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-200">Legal &amp; Contact</h3>
          <ul className="space-y-2 text-sm">
            {LEGAL_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white">{l.label}</Link>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <Mail size={14} /> support@krishibandu.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} /> 1660-01-2323
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} /> Kathmandu, Nepal
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 px-6 py-5 text-center text-xs">
        &copy; {new Date().getFullYear()} Krishi Bandu. All rights reserved.
      </div>
    </footer>
  );
}
