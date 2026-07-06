import { useEffect, useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import api from '../../api/client.js';
import { useToast } from '../../context/ToastContext.jsx';

const EMPTY_FORM = { type: 'general', message: '', region: '', severity: 'low' };

export default function Advisories() {
  const { notify } = useToast();
  const [advisories, setAdvisories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function load() {
    api.get('/advisories').then((res) => setAdvisories(res.data));
  }
  useEffect(load, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post('/advisories', form);
    notify('Advisory published.', 'success');
    setForm(EMPTY_FORM);
    setShowForm(false);
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this advisory?')) return;
    await api.delete(`/advisories/${id}`);
    notify('Advisory deleted.', 'success');
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advisories</h1>
          <p className="text-sm text-gray-500">Broadcast weather, pest, fertilizer and subsidy alerts.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New Advisory'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-2">
          <select value={form.type} onChange={(e) => update('type', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="weather">Weather</option>
            <option value="pest">Pest</option>
            <option value="fertilizer">Fertilizer</option>
            <option value="subsidy">Subsidy</option>
            <option value="general">General</option>
          </select>
          <select value={form.severity} onChange={(e) => update('severity', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input placeholder="Region (e.g. Sindhupalchok)" value={form.region} onChange={(e) => update('region', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-2" />
          <textarea required placeholder="Advisory message" value={form.message} onChange={(e) => update('message', e.target.value)} rows={2} className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-2" />
          <button type="submit" className="sm:col-span-2 rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700">Publish Advisory</button>
        </form>
      )}

      <div className="space-y-3">
        {advisories.map((a) => (
          <div key={a._id} className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm font-medium text-gray-900">{a.message}</p>
              <p className="mt-1 text-xs text-gray-500 capitalize">{a.type} · {a.severity} priority · {a.region}</p>
            </div>
            <button onClick={() => handleDelete(a._id)} className="text-gray-400 hover:text-red-500">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
