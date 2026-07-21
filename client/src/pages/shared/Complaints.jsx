import { useEffect, useState } from 'react';
import { Plus, X, MessageSquareWarning } from 'lucide-react';
import api from '../../api/client.js';
import { useToast } from '../../context/ToastContext.jsx';

const CATEGORIES = [
  { value: 'order', label: 'Order' },
  { value: 'payment', label: 'Payment' },
  { value: 'listing', label: 'Listing' },
  { value: 'account', label: 'Account' },
  { value: 'other', label: 'Other' },
];

const STATUS_STYLE = {
  open: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-primary-100 text-primary-700',
  closed: 'bg-gray-200 text-gray-600',
};

const STATUS_LABEL = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const EMPTY_FORM = { subject: '', category: 'other', description: '' };

export default function Complaints() {
  const { notify } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function load() {
    api.get('/complaints/mine').then((res) => setComplaints(res.data));
  }

  useEffect(load, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/complaints', form);
      notify('Complaint submitted. Our team will review it shortly.', 'success');
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch (err) {
      notify(err.response?.data?.message || 'Could not submit complaint.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="text-sm text-gray-500">Raise an issue and track its status here.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New Complaint'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-2">
          <input
            required
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => update('subject', e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <textarea
            required
            rows={4}
            placeholder="Describe the issue in detail..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-2"
          />
          <button
            disabled={saving}
            type="submit"
            className="rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60 sm:col-span-2"
          >
            {saving ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {complaints.map((c) => (
          <div key={c._id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">{c.subject}</p>
                <p className="text-xs capitalize text-gray-500">{c.category} · {new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[c.status]}`}>
                {STATUS_LABEL[c.status]}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-600">{c.description}</p>
            {c.adminNote && (
              <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                <p className="mb-1 text-xs font-semibold text-gray-500">Response from admin</p>
                {c.adminNote}
              </div>
            )}
          </div>
        ))}
        {complaints.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-400">
            <MessageSquareWarning size={28} />
            No complaints raised yet.
          </div>
        )}
      </div>
    </div>
  );
}
