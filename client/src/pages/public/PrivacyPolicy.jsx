import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../../components/Logo.jsx';
import Footer from '../../components/Footer.jsx';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `When you register for Krishi Bandu, we collect your name, email address, phone number, location, and
    role (farmer, buyer, or admin). As you use the platform, we also store the listings, orders, crop records,
    complaints, and other activity you create so the marketplace can function — for example, an order needs a
    buyer, a seller, and a delivery address to be fulfilled.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `Your information is used to operate the marketplace: matching buyers with sellers, processing orders,
    showing you relevant products and services, sending advisories and weather updates, and letting admins keep
    the platform safe through account and listing moderation. We do not use your data for anything beyond
    running and improving Krishi Bandu.`,
  },
  {
    title: '3. What We Share, and With Whom',
    body: `We do not sell your personal information. When you place or receive an order, your name, contact
    details, and delivery address are shared only with the other party to that order so it can be fulfilled.
    Public listings show your name and general location so buyers can make informed decisions — your email,
    phone number, and password are never shown publicly.`,
  },
  {
    title: '4. How We Store and Protect Your Data',
    body: `Passwords are hashed and never stored in plain text. Access to your account is controlled through a
    login token that only you hold. We take reasonable technical measures to protect your data, but no system
    is completely immune to risk, so please use a strong, unique password and keep it private.`,
  },
  {
    title: '5. Cookies and Local Storage',
    body: `Krishi Bandu uses your browser's local storage to keep you signed in between visits. We do not use
    third-party advertising trackers or sell browsing data to outside companies.`,
  },
  {
    title: '6. Your Rights and Choices',
    body: `You can review and update most of your account details from your profile page at any time. If you
    would like your account or data removed, or have any other privacy concern, contact us using the details
    below and we'll help.`,
  },
  {
    title: '7. Children’s Privacy',
    body: `Krishi Bandu is intended for farmers, buyers, and administrators operating a marketplace, and is not
    directed at children. We do not knowingly collect information from anyone under the age of 16.`,
  },
  {
    title: '8. Changes to This Policy',
    body: `As Krishi Bandu grows, this policy may be updated to reflect new features or legal requirements.
    Material changes will be posted on this page with an updated effective date.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Effective date: July 22, 2026</p>
        <p className="mt-6 text-sm leading-relaxed text-gray-600">
          This policy explains what information Krishi Bandu collects, how it's used, and the choices you have
          as a farmer, buyer, or admin using the platform.
        </p>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-bold text-gray-900">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.body}</p>
            </section>
          ))}

          <section>
            <h2 className="text-lg font-bold text-gray-900">9. Contact Us</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              If you have questions about this policy or your data, reach us at{' '}
              <a href="mailto:support@krishibandu.com" className="font-medium text-primary-600 hover:underline">
                support@krishibandu.com
              </a>{' '}
              or call our support line at 1660-01-2323.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
