import { useState } from 'react';
import { ImagePlus, Sprout, Wrench } from 'lucide-react';
import api from '../api/client.js';
import { mediaUrl } from '../utils/mediaUrl.js';

export const CATEGORY_OPTIONS = {
  product: ['Crops', 'Seeds', 'Organic', 'Tools'],
  service: ['Tractor Service', 'Labor', 'Irrigation', 'Veterinary', 'Consultation', 'Other'],
};

export const UNIT_SUGGESTIONS = {
  product: ['kg', 'dozen', 'liter', 'piece', 'quintal'],
  service: ['hour', 'visit', 'day', 'acre', 'session'],
};

export const EMPTY_LISTING = {
  offerType: 'product',
  name: '',
  description: '',
  variety: '',
  category: CATEGORY_OPTIONS.product[0],
  pricePerKg: '',
  unit: UNIT_SUGGESTIONS.product[0],
  availableQty: '',
  location: '',
  imageUrl: '',
  listingType: 'retail',
};

export function listingFromProduct(p) {
  return {
    offerType: p.offerType || 'product',
    name: p.name,
    description: p.description || '',
    variety: p.variety || '',
    category: p.category,
    pricePerKg: p.pricePerKg,
    unit: p.unit || 'kg',
    availableQty: p.availableQty,
    location: p.location || '',
    imageUrl: p.imageUrl || '',
    listingType: p.listingType,
  };
}

// Shared create/edit form for product & service listings. Kept self-contained
// (owns its own field state + image upload) so it can be dropped into any page
// that needs a "post/edit a listing" flow without duplicating the field logic.
export default function ListingForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState(initial || EMPTY_LISTING);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const isService = form.offerType === 'service';

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setOfferType(offerType) {
    setForm((f) => ({
      ...f,
      offerType,
      category: CATEGORY_OPTIONS[offerType][0],
      unit: UNIT_SUGGESTIONS[offerType][0],
    }));
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

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        pricePerKg: Number(form.pricePerKg),
        availableQty: Number(form.availableQty),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-2 gap-2 sm:w-80">
        <button
          type="button"
          onClick={() => setOfferType('product')}
          className={`flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium ${
            !isService ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'
          }`}
        >
          <Sprout size={15} /> Product
        </button>
        <button
          type="button"
          onClick={() => setOfferType('service')}
          className={`flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium ${
            isService ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'
          }`}
        >
          <Wrench size={15} /> Service
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <input
          required
          placeholder={isService ? 'Title (e.g. Tractor Ploughing)' : 'Title (e.g. Tomato)'}
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-2"
        />
        <select
          value={form.category}
          onChange={(e) => update('category', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {CATEGORY_OPTIONS[form.offerType].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <textarea
          required
          placeholder={
            isService
              ? 'Describe the service: what it covers, how it works, anything a buyer should know'
              : 'Describe the product: freshness, variety, growing method, anything a buyer should know'
          }
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-3"
        />

        {!isService && (
          <input
            placeholder="Variety (e.g. Hybrid)"
            value={form.variety}
            onChange={(e) => update('variety', e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        )}

        <input
          required
          type="number"
          step="0.01"
          placeholder="Price (Rs.)"
          value={form.pricePerKg}
          onChange={(e) => update('pricePerKg', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          list="unit-suggestions"
          placeholder="Unit (e.g. kg, hour, visit)"
          value={form.unit}
          onChange={(e) => update('unit', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <datalist id="unit-suggestions">
          {UNIT_SUGGESTIONS[form.offerType].map((u) => (
            <option key={u} value={u} />
          ))}
        </datalist>

        <input
          required
          type="number"
          placeholder={isService ? 'Available slots' : 'Available quantity'}
          value={form.availableQty}
          onChange={(e) => update('availableQty', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => update('location', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        {!isService && (
          <select
            value={form.listingType}
            onChange={(e) => update('listingType', e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="retail">Retail</option>
            <option value="bulk">Bulk</option>
          </select>
        )}

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

        <div className="flex gap-2 sm:col-span-3">
          <button
            disabled={saving || uploading}
            type="submit"
            className="flex-1 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : submitLabel}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
