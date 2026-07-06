import { useEffect, useState } from 'react';
import { Plus, X, Pencil, Trash2, ImagePlus } from 'lucide-react';
import api from '../../api/client.js';
import { useToast } from '../../context/ToastContext.jsx';
import { mediaUrl } from '../../utils/mediaUrl.js';

const EMPTY_FORM = {
  name: '',
  variety: '',
  category: 'Crops',
  pricePerKg: '',
  availableQty: '',
  location: '',
  imageUrl: '',
  listingType: 'retail',
};

export default function MyProducts() {
  const { notify } = useToast();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  function load() {
    api.get('/products/mine').then((res) => setProducts(res.data));
  }

  useEffect(load, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(p) {
    setEditingId(p._id);
    setForm({
      name: p.name,
      variety: p.variety || '',
      category: p.category,
      pricePerKg: p.pricePerKg,
      availableQty: p.availableQty,
      location: p.location || '',
      imageUrl: p.imageUrl || '',
      listingType: p.listingType,
    });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      pricePerKg: Number(form.pricePerKg),
      availableQty: Number(form.availableQty),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        notify('Product updated.', 'success');
      } else {
        await api.post('/products', payload);
        notify('Product added.', 'success');
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      load();
    } catch (err) {
      notify(err?.response?.data?.message || 'Could not save product.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product listing?')) return;
    await api.delete(`/products/${id}`);
    notify('Product deleted.', 'success');
    load();
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const body = new FormData();
      body.append('image', file);
      const res = await api.post('/uploads', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      update('imageUrl', res.data.url);
    } catch (err) {
      setUploadError(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-sm text-gray-500">Manage your marketplace listings.</p>
        </div>
        <button
          onClick={() => (showForm ? setShowForm(false) : startNew())}
          className="flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-3">
          <input required placeholder="Name (e.g. Tomato)" value={form.name} onChange={(e) => update('name', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input placeholder="Variety (e.g. Hybrid)" value={form.variety} onChange={(e) => update('variety', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <select value={form.category} onChange={(e) => update('category', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option>Crops</option>
            <option>Seeds</option>
            <option>Organic</option>
            <option>Tools</option>
          </select>
          <input required type="number" placeholder="Price per kg (Rs.)" value={form.pricePerKg} onChange={(e) => update('pricePerKg', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required type="number" placeholder="Available Qty (kg)" value={form.availableQty} onChange={(e) => update('availableQty', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input placeholder="Location" value={form.location} onChange={(e) => update('location', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <select value={form.listingType} onChange={(e) => update('listingType', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="retail">Retail</option>
            <option value="bulk">Bulk</option>
          </select>

          <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
            {form.imageUrl && (
              <img src={mediaUrl(form.imageUrl)} alt="Preview" className="h-14 w-14 rounded-lg border border-gray-200 object-cover" />
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-primary-400 hover:text-primary-700">
              <ImagePlus size={16} />
              {uploading ? 'Uploading...' : 'Upload Photo'}
              <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} className="hidden" />
            </label>
            <input
              placeholder="or paste an Image URL"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          {uploadError && <p className="text-xs text-red-600 sm:col-span-3">{uploadError}</p>}

          <button disabled={saving || uploading} type="submit" className="sm:col-span-3 rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
            {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p._id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <img
              src={mediaUrl(p.imageUrl) || 'https://placehold.co/80x80?text=%20'}
              alt={p.name}
              className="h-16 w-16 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">
                {p.name} {p.variety && <span className="font-normal text-gray-500">({p.variety})</span>}
              </p>
              <p className="text-sm text-gray-600">Rs {p.pricePerKg} / kg</p>
              <p className="text-xs text-gray-500">
                Available: {p.availableQty} kg · Location: {p.location || '—'}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => startEdit(p)} className="flex items-center gap-1 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700">
                <Pencil size={13} /> Edit
              </button>
              <button onClick={() => handleDelete(p._id)} className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-400 shadow-sm">
            No products listed yet.
          </p>
        )}
      </div>
    </div>
  );
}
