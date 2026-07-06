import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import api from '../../api/client.js';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { notify } = useToast();
  const [profile, setProfile] = useState({ name: '', phone: '', location: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const [site, setSite] = useState(null);
  const [savingSite, setSavingSite] = useState(false);

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', phone: user.phone || '', location: user.location || '' });
  }, [user]);

  useEffect(() => {
    api.get('/admin/settings').then((res) => setSite(res.data));
  }, []);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(profile);
      notify('Profile updated.', 'success');
    } catch (err) {
      notify(err?.response?.data?.message || 'Could not update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage('');
    try {
      await api.post('/auth/change-password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      notify('Password updated.', 'success');
    } catch (err) {
      const message = err?.response?.data?.message || 'Could not update password.';
      setPasswordMessage(message);
      notify(message, 'error');
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleSiteSubmit(e) {
    e.preventDefault();
    setSavingSite(true);
    try {
      const res = await api.put('/admin/settings', site);
      setSite(res.data);
      notify('Platform settings saved.', 'success');
    } catch (err) {
      notify(err?.response?.data?.message || 'Could not save settings.', 'error');
    } finally {
      setSavingSite(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your administrator account and platform settings.</p>
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700">Your Profile</p>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input disabled value={user?.email || ''} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
          <input
            value={profile.phone}
            onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
          <input
            value={profile.location}
            onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button disabled={savingProfile} type="submit" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {savingProfile ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700">Change Password</p>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
          <input
            required
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
          <input
            required
            type="password"
            minLength={6}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        {passwordMessage && <p className="text-sm text-gray-600">{passwordMessage}</p>}
        <button disabled={savingPassword} type="submit" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {savingPassword ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {site && (
        <form onSubmit={handleSiteSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700">Platform Settings</p>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Site Name</label>
            <input
              value={site.siteName}
              onChange={(e) => setSite((s) => ({ ...s, siteName: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Support Phone</label>
            <input
              value={site.supportPhone}
              onChange={(e) => setSite((s) => ({ ...s, supportPhone: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Support Email</label>
            <input
              value={site.supportEmail}
              onChange={(e) => setSite((s) => ({ ...s, supportEmail: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={site.maintenanceMode}
              onChange={(e) => setSite((s) => ({ ...s, maintenanceMode: e.target.checked }))}
            />
            Maintenance mode
          </label>
          <button disabled={savingSite} type="submit" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
            {savingSite ? 'Saving...' : 'Save Platform Settings'}
          </button>
        </form>
      )}
    </div>
  );
}
