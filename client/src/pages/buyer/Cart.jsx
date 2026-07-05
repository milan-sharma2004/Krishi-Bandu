import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function Cart() {
  const { items, updateQuantity, removeItem, clear, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.location || '');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  async function placeOrder() {
    if (!address) {
      setError('Please enter a delivery address.');
      return;
    }
    setPlacing(true);
    setError('');
    try {
      const res = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
        deliveryAddress: address,
        paymentMethod,
      });
      clear();
      const orders = res.data;
      navigate(orders.length === 1 ? `/buyer/orders/${orders[0]._id}` : '/buyer/orders');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400">
        Your cart is empty.{' '}
        <button onClick={() => navigate('/buyer/browse')} className="font-medium text-primary-600 hover:underline">
          Browse products
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        {items.map(({ product, quantity }) => (
          <div key={product._id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <img src={product.imageUrl || 'https://placehold.co/80x80?text=%20'} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-500">Rs {product.pricePerKg}/kg</p>
            </div>
            <div className="flex items-center rounded-full border border-gray-300">
              <button onClick={() => updateQuantity(product._id, Math.max(1, quantity - 1))} className="p-2 text-gray-500">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button onClick={() => updateQuantity(product._id, quantity + 1)} className="p-2 text-gray-500">
                <Plus size={14} />
              </button>
            </div>
            <p className="w-20 text-right font-semibold text-gray-900">Rs {product.pricePerKg * quantity}</p>
            <button onClick={() => removeItem(product._id)} className="text-gray-400 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-gray-500">Order Summary</p>
        <div className="mb-4 flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">Rs {total}</span>
        </div>

        <label className="mb-1 block text-sm font-medium text-gray-700">Delivery Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option>Cash on Delivery</option>
          <option>eSewa</option>
          <option>Khalti</option>
          <option>Bank Transfer</option>
        </select>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={placeOrder}
          disabled={placing}
          className="w-full rounded-full bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
