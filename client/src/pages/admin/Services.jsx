import { useEffect, useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import api from '../../api/client.js';

const EMPTY_FORM = { name: '', category: 'Tractor Service', provider: '', location: '', contact: '' };

export default function Services() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function load() {
    api.get('/services').then((res) => setServices(res.data));
  }
  useEffect(load, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post('/services', form);
    setForm(EMPTY_FORM);
    setShowForm(false);
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this service?')) return;
    await api.delete(`/services/${id}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Local Services</h1>
          <p className="text-sm text-gray-500">Manage tractor, veterinary, and officer contacts.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-3">
          <select value={form.category} onChange={(e) => update('category', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option>Tractor Service</option>
            <option>Agricultural Officer</option>
            <option>Veterinary Doctor</option>
            <option>Private Practitioner</option>
            <option>Labor</option>
            <option>Irrigation</option>
            <option>Mechanic</option>
          </select>
          <input required placeholder="Service Name" value={form.name} onChange={(e) => update('name', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required placeholder="Provider" value={form.provider} onChange={(e) => update('provider', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required placeholder="Location" value={form.location} onChange={(e) => update('location', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required placeholder="Contact Number" value={form.contact} onChange={(e) => update('contact', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <button type="submit" className="rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700">Save Service</button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs text-gray-500">
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">{s.category}</td>
                <td className="px-4 py-3 text-gray-600">{s.provider}</td>
                <td className="px-4 py-3 text-gray-600">{s.location}</td>
                <td className="px-4 py-3 text-gray-600">{s.contact}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(s._id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
