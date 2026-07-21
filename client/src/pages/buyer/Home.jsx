import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ClipboardList, ArrowRight } from 'lucide-react';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { mediaUrl } from '../../utils/mediaUrl.js';

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data.slice(0, 4)));
    api.get('/orders/mine').then((res) => setOrders(res.data.slice(0, 3)));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hi, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-gray-500">Find fresh produce directly from Nepali farmers.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/buyer/browse" className="flex items-center justify-between rounded-xl bg-primary-600 p-5 text-white shadow-sm hover:bg-primary-700">
          <div>
            <p className="font-semibold">Browse Products</p>
            <p className="text-sm opacity-90">Crops, seeds, organic & tools</p>
          </div>
          <Search size={22} />
        </Link>
        <Link to="/buyer/orders" className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:bg-gray-50">
          <div>
            <p className="font-semibold text-gray-900">My Orders</p>
            <p className="text-sm text-gray-500">Track status & delivery</p>
          </div>
          <ClipboardList size={22} className="text-gray-400" />
        </Link>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-500">Featured Products</p>
          <Link to="/buyer/browse" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products.map((p) => (
            <Link key={p._id} to={`/buyer/products/${p._id}`} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md">
              <img src={mediaUrl(p.imageUrl) || 'https://placehold.co/200x140?text=%20'} alt={p.name} className="mb-2 h-24 w-full rounded-lg object-cover" />
              <p className="truncate text-sm font-semibold text-gray-900">{p.name}</p>
              <p className="text-xs text-gray-500">Rs {p.pricePerKg}/{p.unit || 'kg'}</p>
            </Link>
          ))}
        </div>
      </div>

      {orders.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold text-gray-500">Recent Orders</p>
          <div className="space-y-2">
            {orders.map((o) => (
              <Link key={o._id} to={`/buyer/orders/${o._id}`} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Order #{o.orderCode}</p>
                  <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">Rs {o.totalAmount}</p>
                  <p className="text-xs text-primary-600">{o.status}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
