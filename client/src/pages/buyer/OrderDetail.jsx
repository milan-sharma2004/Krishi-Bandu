import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Truck } from 'lucide-react';
import api from '../../api/client.js';

const STATUS_STYLE = {
  Pending: 'bg-gray-100 text-gray-600',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-amber-100 text-amber-700',
  Delivered: 'bg-primary-100 text-primary-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <p className="py-10 text-center text-gray-400">Loading order...</p>;

  const stepIndex = STEPS.indexOf(order.status);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Order #{order.orderCode}</h1>
          <p className="text-sm text-gray-500">Seller: {order.seller?.name}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLE[order.status]}`}>{order.status}</span>
      </div>

      {stepIndex >= 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-1 items-center">
              <div className={`h-2.5 w-2.5 rounded-full ${i <= stepIndex ? 'bg-primary-600' : 'bg-gray-200'}`} />
              {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < stepIndex ? 'bg-primary-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-gray-500">Items</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400">
              <th className="pb-2 font-medium">Product</th>
              <th className="pb-2 font-medium">Quantity</th>
              <th className="pb-2 font-medium">Price (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="py-2 font-medium text-gray-800">{item.name}</td>
                <td className="py-2 text-gray-600">{item.quantity} kg</td>
                <td className="py-2 text-gray-600">{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex justify-between py-1 text-sm">
          <span className="text-gray-500">Total Amount</span>
          <span className="font-semibold text-gray-900">Rs {order.totalAmount}</span>
        </div>
        <div className="flex justify-between py-1 text-sm">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
        </div>
        <div className="flex justify-between py-1 text-sm">
          <span className="text-gray-500">Order Date</span>
          <span className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between py-1 text-sm">
          <span className="text-gray-500">Delivery Address</span>
          <span className="text-right font-semibold text-gray-900">{order.deliveryAddress}</span>
        </div>
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700">
        <Truck size={16} /> Track Order
      </button>
    </div>
  );
}
