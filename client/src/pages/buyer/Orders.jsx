import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client.js';

const STATUS_STYLE = {
  Pending: 'bg-gray-100 text-gray-600',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-amber-100 text-amber-700',
  Delivered: 'bg-primary-100 text-primary-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

      <div className="space-y-3">
        {orders.map((o) => (
          <Link key={o._id} to={`/buyer/orders/${o._id}`} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50">
            <div>
              <p className="font-semibold text-gray-900">Order #{o.orderCode}</p>
              <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">Rs {o.totalAmount}</p>
              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[o.status]}`}>{o.status}</span>
            </div>
          </Link>
        ))}
        {orders.length === 0 && (
          <p className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-400 shadow-sm">
            You haven't placed any orders yet.
          </p>
        )}
      </div>
    </div>
  );
}
