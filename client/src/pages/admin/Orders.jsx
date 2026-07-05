import { useEffect, useState } from 'react';
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
    api.get('/orders/all').then((res) => setOrders(res.data));
  }, []);

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
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
