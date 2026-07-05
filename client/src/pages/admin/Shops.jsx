import { useEffect, useState } from 'react';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import api from '../../api/client.js';

const EMPTY_FORM = { name: '', location: '', distanceKm: '', tags: '' };

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  function load() {
    api.get('/shops').then((res) => setShops(res.data));
  }
  useEffect(load, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(s) {
    setEditingId(s._id);
    setForm({ name: s.name, location: s.location, distanceKm: s.distanceKm, tags: s.tags.join(', ') });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      distanceKm: Number(form.distanceKm),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (editingId) {
      await api.put(`/shops/${editingId}`, payload);
    } else {
      await api.post('/shops', payload);
    }
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this shop?')) return;
    await api.delete(`/shops/${id}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agri Shops</h1>
          <p className="text-sm text-gray-500">Manage the shops directory shown to farmers.</p>
        </div>
        <button onClick={() => (showForm ? setShowForm(false) : startNew())} className="flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Shop'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-2">
          <input required placeholder="Shop Name" value={form.name} onChange={(e) => update('name', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required placeholder="Location" value={form.location} onChange={(e) => update('location', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required type="number" step="0.1" placeholder="Distance (km)" value={form.distanceKm} onChange={(e) => update('distanceKm', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => update('tags', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <button type="submit" className="sm:col-span-2 rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            {editingId ? 'Update Shop' : 'Save Shop'}
          </button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((s) => (
          <div key={s._id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-start justify-between">
              <p className="font-semibold text-gray-900">{s.name}</p>
              <div className="flex gap-2">
                <button onClick={() => startEdit(s)} className="text-gray-400 hover:text-primary-600">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(s._id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <p className="mb-2 text-xs text-gray-500">{s.location} · {s.distanceKm} km</p>
            <div className="flex flex-wrap gap-1.5">
              {s.tags.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
