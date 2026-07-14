import { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import Logo from '../../components/Logo.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRoleHomePath } from '../../utils/roleRedirect.js';

export default function Login() {
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    loading,
    isAuthenticated,
    login,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role) {
      const destination =
        location.state?.from?.pathname ||
        getRoleHomePath(user.role);

      navigate(destination, {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    loading,
    navigate,
    user?.role,
    location.state,
  ]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setSubmitting(true);

    try {
      await login(
        email.trim(),
        password,
        rememberMe
      );

      notify('Signed in successfully.', 'success');
    } catch (err) {
      const message =
        err.message ||
        'Unable to log in. Please try again.';

      setError(message);
      notify(message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Log in to continue to Krishi Bandu
            </p>
          </div>

          {location.state?.registrationPending && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Registration submitted successfully. You can
              log in after the administrator approves your
              account.
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />

              Remember me on this device
            </label>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Need a fresh account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:underline"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}