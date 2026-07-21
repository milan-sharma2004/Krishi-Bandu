import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import { useToast } from '../../context/ToastContext.jsx';

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

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

export default function Complaints() {
  const { notify } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [drafts, setDrafts] = useState({});

  function load() {
    api.get('/complaints').then((res) => setComplaints(res.data));
  }

  useEffect(load, []);

  function draftFor(c) {
    return drafts[c._id] ?? { status: c.status, adminNote: c.adminNote || '' };
  }

  function updateDraft(c, key, value) {
    setDrafts((d) => ({ ...d, [c._id]: { ...draftFor(c), [key]: value } }));
  }

  async function save(c) {
    const draft = draftFor(c);
    try {
      await api.patch(`/complaints/${c._id}`, draft);
      notify(`Complaint "${c.subject}" updated.`, 'success');
      setDrafts((d) => {
        const next = { ...d };
        delete next[c._id];
        return next;
      });
      load();
    } catch (err) {
      notify(err.response?.data?.message || 'Could not update complaint.', 'error');
    }
  }

  const filtered = complaints.filter((c) => statusFilter === 'All' || c.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="text-sm text-gray-500">
            {filtered.length} of {complaints.length} complaints
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const draft = draftFor(c);
          const dirty = draft.status !== c.status || draft.adminNote !== (c.adminNote || '');
          return (
            <div key={c._id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{c.subject}</p>
                  <p className="text-xs capitalize text-gray-500">
                    {c.user?.name} ({c.user?.email}) · {c.category} · {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[c.status]}`}>
                  {STATUS_LABEL[c.status]}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-600">{c.description}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr_auto] sm:items-start">
                <select
                  value={draft.status}
                  onChange={(e) => updateDraft(c, 'status', e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                  ))}
                </select>
                <textarea
                  rows={2}
                  placeholder="Add a note or response for the user..."
                  value={draft.adminNote}
                  onChange={(e) => updateDraft(c, 'adminNote', e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  disabled={!dirty}
                  onClick={() => save(c)}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-400">
            No complaints found.
          </div>
        )}
      </div>
    </div>
  );
}
