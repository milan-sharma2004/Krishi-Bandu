import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, CheckCircle2, Circle } from 'lucide-react';
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

export default function OrderDetail() {
  const { id } = useParams();
  const { notify } = useToast();
  const [order, setOrder] = useState(null);
  const [logisticsForm, setLogisticsForm] = useState({ estimatedDelivery: '', courierName: '', courierContact: '' });
  const [saving, setSaving] = useState(false);

  function load() {
    return api.get(`/orders/${id}`).then((res) => {
      setOrder(res.data);
      setLogisticsForm({
        estimatedDelivery: toDateInputValue(res.data.estimatedDelivery),
        courierName: res.data.courierName || '',
        courierContact: res.data.courierContact || '',
      });
    });
  }

  useEffect(() => {
    load();
  }, [id]);

  async function changeStatus(status) {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      notify(`Order marked ${status}.`, 'success');
      load();
    } catch (err) {
      notify(err?.response?.data?.message || 'Could not update order status.', 'error');
    }
  }

  async function saveLogistics(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/orders/${id}/status`, {
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

  if (!order) return <p className="py-10 text-center text-gray-400">Loading order...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/farmer/orders" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Order #{order.orderCode}</h1>
          <p className="text-sm text-gray-500">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <select
          value={order.status}
          onChange={(e) => changeStatus(e.target.value)}
          className={`rounded-full border-0 px-3 py-1.5 text-sm font-medium ${STATUS_STYLE[order.status]}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Buyer</p>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User size={15} className="text-gray-400" /> {order.buyer?.name}
        </div>
        {order.buyer?.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone size={15} className="text-gray-400" /> {order.buyer.phone}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin size={15} className="text-gray-400" /> {order.deliveryAddress}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-gray-500">Items Ordered</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400">
              <th className="pb-2 font-medium">Product</th>
              <th className="pb-2 font-medium">Quantity</th>
              <th className="pb-2 font-medium">Price</th>
              <th className="pb-2 font-medium text-right">Subtotal (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="py-2 font-medium text-gray-800">{item.name}</td>
                <td className="py-2 text-gray-600">{item.quantity}</td>
                <td className="py-2 text-gray-600">Rs {item.price}</td>
                <td className="py-2 text-right font-medium text-gray-800">{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-sm">
          <span className="text-gray-500">Total ({order.paymentMethod})</span>
          <span className="font-bold text-gray-900">Rs {order.totalAmount}</span>
        </div>
      </div>

      <form onSubmit={saveLogistics} className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Delivery Logistics</p>
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
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Delivery Details'}
        </button>
      </form>

      {order.statusHistory?.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-500">Status History</p>
          <ul className="space-y-3">
            {[...order.statusHistory].reverse().map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                {i === 0 ? (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary-600" />
                ) : (
                  <Circle size={16} className="mt-0.5 shrink-0 text-gray-300" />
                )}
                <div>
                  <p className={i === 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}>{h.status}</p>
                  <p className="text-xs text-gray-400">{new Date(h.changedAt).toLocaleString()}</p>
                  {h.note && <p className="text-xs text-gray-500">{h.note}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
