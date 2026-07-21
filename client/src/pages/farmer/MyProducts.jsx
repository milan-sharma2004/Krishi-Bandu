import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Store, ChevronDown, ExternalLink } from 'lucide-react';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import ListingForm, { EMPTY_LISTING, listingFromProduct } from '../../components/ListingForm.jsx';
import ListingCard from '../../components/ListingCard.jsx';

export default function MyProducts() {
  const { user, updateProfile } = useAuth();
  const { notify } = useToast();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showShopForm, setShowShopForm] = useState(false);
  const [shopForm, setShopForm] = useState({ shopName: '', shopDescription: '', location: '' });
  const [savingShop, setSavingShop] = useState(false);

  useEffect(() => {
    if (user) {
      setShopForm({
        shopName: user.shopName || '',
        shopDescription: user.shopDescription || '',
        location: user.location || '',
      });
    }
  }, [user]);

  async function handleShopSubmit(e) {
    e.preventDefault();
    setSavingShop(true);
    try {
      await updateProfile(shopForm);
      notify('Shop info updated.', 'success');
      setShowShopForm(false);
    } catch (err) {
      notify(err?.response?.data?.message || 'Could not update shop info.', 'error');
    } finally {
      setSavingShop(false);
    }
  }

  function load() {
    api.get('/products/mine').then((res) => setProducts(res.data));
  }

  useEffect(load, []);

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
        notify('Listing added.', 'success');
      }
      setShowForm(false);
      setEditingId(null);
      load();
    } catch (err) {
      notify(err?.response?.data?.message || 'Could not save listing.', 'error');
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"?`)) return;
    await api.delete(`/products/${product._id}`);
    notify('Listing deleted.', 'success');
    load();
  }

  const editingProduct = editingId ? products.find((p) => p._id === editingId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-500">
            Post daily products or services. New listings appear on the buyer marketplace immediately.
          </p>
        </div>
        <button
          onClick={() => (showForm ? setShowForm(false) : startNew())}
          className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add New Listing'}
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <button
          onClick={() => setShowShopForm((s) => !s)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Store size={16} className="text-primary-600" />
            {user?.shopName || 'Set up your shop'}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${showShopForm ? 'rotate-180' : ''}`} />
        </button>

        {showShopForm && (
          <form onSubmit={handleShopSubmit} className="grid gap-3 border-t border-gray-100 p-4 sm:grid-cols-2">
            <input
              placeholder="Shop name (e.g. Ravi's Organic Farm)"
              value={shopForm.shopName}
              onChange={(e) => setShopForm((f) => ({ ...f, shopName: e.target.value }))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-2"
            />
            <textarea
              placeholder="Short description buyers will see on your shop page"
              value={shopForm.shopDescription}
              onChange={(e) => setShopForm((f) => ({ ...f, shopDescription: e.target.value }))}
              rows={2}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              placeholder="Shop location"
              value={shopForm.location}
              onChange={(e) => setShopForm((f) => ({ ...f, location: e.target.value }))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              disabled={savingShop}
              type="submit"
              className="rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {savingShop ? 'Saving...' : 'Save Shop Info'}
            </button>
            {user?._id && (
              <Link
                to={`/buyer/sellers/${user._id}`}
                target="_blank"
                className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 sm:col-span-2"
              >
                <ExternalLink size={14} /> Preview My Shop
              </Link>
            )}
          </form>
        )}
      </div>

      {showForm && (
        <ListingForm
          key={editingId || 'new'}
          initial={editingProduct ? listingFromProduct(editingProduct) : EMPTY_LISTING}
          onSubmit={handleSave}
          onCancel={() => setShowForm(false)}
          submitLabel={editingId ? 'Update Listing' : 'Add Listing'}
        />
      )}

      <div className="space-y-3">
        {products.map((p) => (
          <ListingCard key={p._id} product={p} onEdit={startEdit} onDelete={handleDelete} />
        ))}
        {products.length === 0 && (
          <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-400 shadow-sm">
            No listings yet. Add your first product or service above.
          </p>
        )}
      </div>
    </div>
  );
}
