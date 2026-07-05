import { useEffect, useState } from 'react';
import api from '../../api/client.js';

const ROLE_STYLE = {
  farmer: 'bg-primary-100 text-primary-700',
  buyer: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');

  function load() {
    api.get('/admin/users').then((res) => setUsers(res.data));
  }

  useEffect(load, []);

  async function toggleStatus(user) {
    const status = user.status === 'active' ? 'suspended' : 'active';
    await api.patch(`/admin/users/${user._id}/status`, { status });
    load();
  }

  const filtered = roleFilter === 'All' ? users : users.filter((u) => u.role === roleFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">{users.length} total accounts</p>
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option>All</option>
          <option value="farmer">Farmer</option>
          <option value="buyer">Buyer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs text-gray-500">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map((u) => (
              <tr key={u._id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${ROLE_STYLE[u.role]}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{u.location || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.status === 'active' ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.role !== 'admin' && (
                    <button onClick={() => toggleStatus(u)} className="text-xs font-semibold text-primary-600 hover:underline">
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
