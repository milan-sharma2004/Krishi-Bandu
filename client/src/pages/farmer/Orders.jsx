import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ChevronDown } from 'lucide-react';
import api from '../../api/client.js';
import { useToast } from '../../context/ToastContext.jsx';

const STATUS_STYLE = {
  Pending: 'bg-gray-100 text-gray-600',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-amber-100 text-amber-700',
  Delivered: 'bg-primary-100 text-primary-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const STATUS_OPTIONS = Object.keys(STATUS_STYLE);

function toDateInputValue(date) {
  if (!date) return '';
  return new Date(date).toISOString().slice(0, 10);
}

export default function Orders() {
  const { notify } = useToast();
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [logisticsForm, setLogisticsForm] = useState({ estimatedDelivery: '', courierName: '', courierContact: '' });
  const [saving, setSaving] = useState(false);

  function load() {
    api.get('/orders/selling').then((res) => setOrders(res.data));
  }

  useEffect(load, []);

  async function changeStatus(order, status) {
    try {
      await api.patch(`/orders/${order._id}/status`, { status });
      notify(`Order #${order.orderCode} marked ${status}.`, 'success');
      load();
    } catch (err) {
      notify(err?.response?.data?.message || 'Could not update order status.', 'error');
    }
  }

  function toggleExpand(order) {
    if (expandedId === order._id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(order._id);
    setLogisticsForm({
      estimatedDelivery: toDateInputValue(order.estimatedDelivery),
      courierName: order.courierName || '',
      courierContact: order.courierContact || '',
    });
  }

  async function saveLogistics(order) {
    setSaving(true);
    try {
      await api.patch(`/orders/${order._id}/status`, {
        estimatedDelivery: logisticsForm.estimatedDelivery || null,
        courierName: logisticsForm.courierName,
        courierContact: logisticsForm.courierContact,
      });
      notify('Delivery details updated.', 'success');
      load();
    } catch (err) {
      notify(err?.response?.data?.message || 'Could not update delivery details.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">Update delivery status and logistics for orders buyers placed with you.</p>
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <Link to={`/farmer/orders/${o._id}`} className="font-semibold text-primary-600 hover:underline">
                  Order #{o.orderCode}
                </Link>
                <p className="text-xs text-gray-500">
                  {o.buyer?.name} · {o.buyer?.location} · {new Date(o.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-gray-900">Rs {o.totalAmount}</p>
                <select
                  value={o.status}
                  onChange={(e) => changeStatus(o, e.target.value)}
                  className={`rounded-full border-0 px-2 py-1 text-xs font-medium ${STATUS_STYLE[o.status]}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => toggleExpand(o)}
                  className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  <Truck size={13} /> Logistics
                  <ChevronDown size={13} className={`transition-transform ${expandedId === o._id ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {expandedId === o._id && (
              <div className="space-y-3 border-t border-gray-100 p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Estimated Delivery</label>
                    <input
                      type="date"
                      value={logisticsForm.estimatedDelivery}
                      onChange={(e) => setLogisticsForm((f) => ({ ...f, estimatedDelivery: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Courier / Delivery Person</label>
                    <input
                      placeholder="e.g. Nepal Courier Service"
                      value={logisticsForm.courierName}
                      onChange={(e) => setLogisticsForm((f) => ({ ...f, courierName: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Courier Contact</label>
                    <input
                      placeholder="Phone number"
                      value={logisticsForm.courierContact}
                      onChange={(e) => setLogisticsForm((f) => ({ ...f, courierContact: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <button
                  disabled={saving}
                  onClick={() => saveLogistics(o)}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Delivery Details'}
                </button>

                {o.statusHistory?.length > 0 && (
                  <div className="pt-2">
                    <p className="mb-2 text-xs font-semibold text-gray-500">Status History</p>
                    <ul className="space-y-1">
                      {o.statusHistory.map((h, i) => (
                        <li key={i} className="text-xs text-gray-600">
                          <span className="font-medium text-gray-800">{h.status}</span> — {new Date(h.changedAt).toLocaleString()}
                          {h.note && <span className="text-gray-400"> ({h.note})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && (
          <p className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-400 shadow-sm">
            No orders yet.
          </p>
        )}
      </div>
    </div>
  );
}
