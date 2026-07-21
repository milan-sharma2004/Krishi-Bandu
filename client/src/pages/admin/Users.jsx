import { useEffect, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import api from '../../api/client.js';
import { useToast } from '../../context/ToastContext.jsx';

const ROLE_STYLE = {
  farmer: 'bg-primary-100 text-primary-700',
  seller: 'bg-orange-100 text-orange-700',
  buyer: 'bg-blue-100 text-blue-700',
  expert: 'bg-teal-100 text-teal-700',
  admin: 'bg-purple-100 text-purple-700',
};

const APPROVAL_STYLE = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function Users() {
  const { notify } = useToast();

  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');

  function load() {
    api
      .get('/admin/users')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        notify(error.response?.data?.message || 'Could not load users.', 'error');
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleStatus(user) {
    const status = user.status === 'active' ? 'suspended' : 'active';

    try {
      await api.patch(`/admin/users/${user._id}/status`, { status });

      notify(`${user.name} ${status === 'active' ? 'activated' : 'suspended'}.`, 'success');

      load();
    } catch (error) {
      notify(error.response?.data?.message || 'Could not update account status.', 'error');
    }
  }

  async function approveUser(user) {
    try {
      await api.patch(`/admin/users/${user._id}/approval`, {
        approvalStatus: 'approved',
      });

      notify(`${user.name}'s account has been approved.`, 'success');

      load();
    } catch (error) {
      notify(error.response?.data?.message || 'Could not approve this account.', 'error');
    }
  }

  async function rejectUser(user) {
    const rejectionReason = window.prompt('Enter the reason for rejecting this registration:');

    if (rejectionReason === null) {
      return;
    }

    try {
      await api.patch(`/admin/users/${user._id}/approval`, {
        approvalStatus: 'rejected',
        rejectionReason: rejectionReason.trim(),
      });

      notify(`${user.name}'s registration has been rejected.`, 'success');

      load();
    } catch (error) {
      notify(error.response?.data?.message || 'Could not reject this account.', 'error');
    }
  }

  async function handleDelete(user) {
    const confirmed = window.confirm(`Delete ${user.name}'s account? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/users/${user._id}`);

      notify(`${user.name}'s account deleted.`, 'success');

      load();
    } catch (error) {
      notify(error.response?.data?.message || 'Could not delete this account.', 'error');
    }
  }

  const filtered = users
    .filter((user) => roleFilter === 'All' || user.role === roleFilter)
    .filter((user) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q);
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>

          <p className="text-sm text-gray-500">
            {filtered.length} of {users.length} total accounts
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 text-sm sm:w-64"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="All">All roles</option>
            <option value="farmer">Farmer</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
            <option value="expert">Expert</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs text-gray-500">
              <th className="px-4 py-3 font-medium">Name</th>

              <th className="px-4 py-3 font-medium">Email</th>

              <th className="px-4 py-3 font-medium">Role</th>

              <th className="px-4 py-3 font-medium">Location</th>

              <th className="px-4 py-3 font-medium">Account Status</th>

              <th className="px-4 py-3 font-medium">Approval</th>

              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.slice(0, 100).map((user) => {
              const approvalStatus = user.approvalStatus || 'approved';

              return (
                <tr key={user._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>

                  <td className="px-4 py-3 text-gray-600">{user.email}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        ROLE_STYLE[user.role] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600">{user.location || '—'}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        user.status === 'active' ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        APPROVAL_STYLE[approvalStatus] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {approvalStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {user.role !== 'admin' && (
                      <div className="flex flex-wrap items-center gap-3">
                        {approvalStatus === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => approveUser(user)}
                              className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() => rejectUser(user)}
                              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleStatus(user)}
                          className="text-xs font-semibold text-primary-600 hover:underline"
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label={`Delete ${user.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                  No user accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
