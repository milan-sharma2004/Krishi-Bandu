import { useAuth } from '../../context/AuthContext.jsx';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your administrator account.</p>
      </div>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input disabled value={user?.name || ''} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input disabled value={user?.email || ''} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
          <input disabled value="Administrator" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500" />
        </div>
        <p className="text-xs text-gray-400">Account editing isn't enabled in this build.</p>
      </div>
    </div>
  );
}
