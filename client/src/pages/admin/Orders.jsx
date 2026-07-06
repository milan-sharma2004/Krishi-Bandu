import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
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

export default function Orders() {
  const { notify } = useToast();
  const [orders, setOrders] = useState([]);

  function load() {
    api.get('/orders/all').then((res) => setOrders(res.data));
  }

  useEffect(load, []);

  async function changeStatus(order, status) {
    await api.patch(`/admin/orders/${order._id}/status`, { status });
    notify(`Order #${order.orderCode} marked ${status}.`, 'success');
    load();
  }

  async function handleDelete(order) {
    if (!confirm(`Delete order #${order.orderCode}? This cannot be undone.`)) return;
    await api.delete(`/admin/orders/${order._id}`);
    notify(`Order #${order.orderCode} deleted.`, 'success');
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">{orders.length} orders placed across the platform</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs text-gray-500">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Buyer</th>
              <th className="px-4 py-3 font-medium">Seller</th>
              <th className="px-4 py-3 font-medium">Amount (Rs.)</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 150).map((o) => (
              <tr key={o._id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">#{o.orderCode}</td>
                <td className="px-4 py-3 text-gray-600">{o.buyer?.name}</td>
                <td className="px-4 py-3 text-gray-600">{o.seller?.name}</td>
                <td className="px-4 py-3 text-gray-600">{o.totalAmount}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => changeStatus(o, e.target.value)}
                    className={`rounded-full border-0 px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[o.status]}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(o)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={14} />
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
