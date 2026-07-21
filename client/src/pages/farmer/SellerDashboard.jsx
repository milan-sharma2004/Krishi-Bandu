import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Package, ClipboardList, Wallet, ExternalLink } from 'lucide-react';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import ListingForm, { EMPTY_LISTING, listingFromProduct } from '../../components/ListingForm.jsx';
import ListingCard from '../../components/ListingCard.jsx';

const STATUS_STYLE = {
  Pending: 'bg-gray-100 text-gray-600',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-amber-100 text-amber-700',
  Delivered: 'bg-primary-100 text-primary-700',
  Cancelled: 'bg-red-100 text-red-700',
};
const STATUS_OPTIONS = Object.keys(STATUS_STYLE);
const PENDING_ACTION_STATUSES = ['Pending', 'Confirmed'];

function QuickStat({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="truncate text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [products, setProducts] = useState(null);
  const [orders, setOrders] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  function loadProducts() {
    api.get('/products/mine').then((res) => setProducts(res.data));
  }

  function loadOrders() {
    api.get('/orders/selling').then((res) => setOrders(res.data));
  }

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  function startEdit(p) {
    setEditingId(p._id);
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setShowForm(true);
  }

  async function handleSave(payload) {
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        notify('Listing updated.', 'success');
      } else {
        await api.post('/products', payload);
        notify('Listing posted.', 'success');
      }
      setShowForm(false);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      notify(err?.response?.data?.message || 'Could not save listing.', 'error');
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"?`)) return;
    await api.delete(`/products/${product._id}`);
    notify('Listing deleted.', 'success');
    loadProducts();
  }

  async function handleStatusChange(order, status) {
    try {
      await api.patch(`/orders/${order._id}/status`, { status });
      notify(`Order #${order.orderCode} marked ${status}.`, 'success');
      loadOrders();
    } catch (err) {
      notify(err?.response?.data?.message || 'Could not update order status.', 'error');
    }
  }

  if (!products || !orders) {
    return <p className="py-10 text-center text-gray-400">Loading your seller dashboard...</p>;
  }

  const activeListings = products.filter((p) => p.status === 'active');
  const pendingOrders = orders.filter((o) => PENDING_ACTION_STATUSES.includes(o.status));
  const revenue = orders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalAmount, 0);
  const editingProduct = editingId ? products.find((p) => p._id === editingId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-sm text-gray-500">Post, manage, and track your listings and orders in one place.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => (showForm ? setShowForm(false) : startNew())}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 sm:flex-none"
          >
            {showForm ? <X size={15} /> : <Plus size={15} />}
            {showForm ? 'Cancel' : 'Post New'}
          </button>
          {user?._id && (
            <Link
              to={`/buyer/sellers/${user._id}`}
              target="_blank"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 sm:flex-none"
            >
              <ExternalLink size={15} /> View Shop
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <QuickStat label="Active Listings" value={activeListings.length} icon={Package} />
        <QuickStat label="Needs Action" value={pendingOrders.length} icon={ClipboardList} />
        <QuickStat label="Revenue" value={`Rs ${revenue.toLocaleString()}`} icon={Wallet} />
      </div>

      {showForm && (
        <ListingForm
          key={editingId || 'new'}
          initial={editingProduct ? listingFromProduct(editingProduct) : EMPTY_LISTING}
          onSubmit={handleSave}
          onCancel={() => setShowForm(false)}
          submitLabel={editingId ? 'Update Listing' : 'Post Listing'}
        />
      )}

      <div>
        <p className="mb-3 text-sm font-semibold text-gray-500">Active Listings ({activeListings.length})</p>
        <div className="space-y-3">
          {activeListings.map((p) => (
            <ListingCard key={p._id} product={p} onEdit={startEdit} onDelete={handleDelete} />
          ))}
          {activeListings.length === 0 && (
            <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-400 shadow-sm">
              No active listings yet. Tap "Post New" to add your first product or service.
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-500">Orders &amp; Requests</p>
          <Link to="/farmer/orders" className="text-xs font-medium text-primary-600 hover:underline">
            Full order management &amp; logistics →
          </Link>
        </div>
        <div className="space-y-2">
          {orders.slice(0, 10).map((o) => (
            <div
              key={o._id}
              className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <Link to={`/farmer/orders/${o._id}`} className="text-sm font-semibold text-primary-600 hover:underline">
                  #{o.orderCode}
                </Link>
                <p className="truncate text-xs text-gray-500">
                  {o.buyer?.name} · {o.items.length} item{o.items.length === 1 ? '' : 's'} · Rs {o.totalAmount} · {new Date(o.createdAt).toLocaleDateString()}
                </p>
              </div>
              <select
                value={o.status}
                onChange={(e) => handleStatusChange(o, e.target.value)}
                className={`w-full rounded-full border-0 px-3 py-1.5 text-xs font-medium sm:w-auto ${STATUS_STYLE[o.status]}`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-400 shadow-sm">
              No orders or requests yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
