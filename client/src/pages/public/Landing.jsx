import { Link } from 'react-router-dom';
import { Sprout, Users, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import Logo from '../../components/Logo.jsx';

const ROLES = [
  {
    icon: Sprout,
    title: 'Seller / Farmer',
    desc: 'List products, get advice, access services, sell & grow',
    color: 'bg-primary-600',
  },
  {
    icon: ShoppingBag,
    title: 'Buyer / Consumer',
    desc: 'Browse products, compare prices, and place orders',
    color: 'bg-blue-600',
  },
  {
    icon: ShieldCheck,
    title: 'Admin',
    desc: 'Manage users, monitor system, and generate reports',
    color: 'bg-purple-600',
  },
];

const FEATURES = [
  'Marketplace for bulk & retail crop trading',
  'Farming advice, weather & seasonal tips',
  'Disease & pest alerts with remedies',
  'Field preparation guidance',
  'Local services: tractors, labor, irrigation',
  'Agri shops directory for inputs',
  'Daily market price information',
  'Order management & delivery tracking',
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <span className="mb-4 inline-block rounded-full bg-primary-50 px-4 py-1 text-sm font-medium text-primary-700">
          Smart Farming, Prosperous Farmers
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
          A farmer's companion, a bridge to markets
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Krishi Bandu is an integrated AgriTech system that helps farmers with crop planning,
          weather information, market prices, advisory support, and buying and selling.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/register"
            className="flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
          >
            Join Krishi Bandu <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Log in
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
          User Roles
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {ROLES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="rounded-2xl border border-gray-200 p-6">
              <span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${color} text-white`}>
                <Icon size={20} />
              </span>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2 rounded-xl bg-white p-4 shadow-sm">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                <p className="text-sm text-gray-700">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-primary-700 py-6 text-center text-sm text-primary-50">
        Krishi Bandu — Trusted by Nepali Farmers, Supporting Smarter Agriculture.
      </footer>
    </div>
  );
}
