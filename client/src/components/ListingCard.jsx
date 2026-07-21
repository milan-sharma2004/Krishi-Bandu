import { Pencil, Trash2, Sprout, Wrench } from 'lucide-react';
import { mediaUrl } from '../utils/mediaUrl.js';

export default function ListingCard({ product, onEdit, onDelete }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <img
        src={mediaUrl(product.imageUrl) || 'https://placehold.co/80x80?text=%20'}
        alt={product.name}
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              product.offerType === 'service' ? 'bg-teal-100 text-teal-700' : 'bg-primary-100 text-primary-700'
            }`}
          >
            {product.offerType === 'service' ? <Wrench size={11} /> : <Sprout size={11} />}
            {product.offerType === 'service' ? 'Service' : 'Product'}
          </span>
          {product.status && (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {product.status}
            </span>
          )}
          <p className="font-semibold text-gray-900">
            {product.name} {product.variety && <span className="font-normal text-gray-500">({product.variety})</span>}
          </p>
        </div>
        {product.description && <p className="mt-0.5 truncate text-xs text-gray-500">{product.description}</p>}
        <p className="text-sm text-gray-600">
          Rs {product.pricePerKg} / {product.unit || 'kg'}
        </p>
        <p className="text-xs text-gray-500">
          Available: {product.availableQty} {product.unit || 'kg'} · {product.location || 'No location set'}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex flex-1 items-center justify-center gap-1 rounded-full bg-primary-600 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700 sm:flex-none sm:py-1.5"
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={() => onDelete(product)}
          className="flex flex-1 items-center justify-center gap-1 rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 sm:flex-none sm:py-1.5"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
  );
}
