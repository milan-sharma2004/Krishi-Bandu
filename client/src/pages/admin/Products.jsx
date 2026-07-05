import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../api/client.js';

export default function Products() {
  const [products, setProducts] = useState([]);

  function load() {
    api.get('/admin/products').then((res) => setProducts(res.data));
  }

  useEffect(load, []);

  async function toggleStatus(product) {
    const status = product.status === 'active' ? 'inactive' : 'active';
    await api.patch(`/admin/products/${product._id}/status`, { status });
    load();
  }

  async function handleDelete(product) {
    if (!confirm(`Delete listing "${product.name}"? This cannot be undone.`)) return;
    await api.delete(`/admin/products/${product._id}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500">{products.length} marketplace listings</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs text-gray-500">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Seller</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price (Rs./kg)</th>
              <th className="px-4 py-3 font-medium">Available Qty</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {p.name} {p.variety && <span className="font-normal text-gray-500">({p.variety})</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.seller?.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                <td className="px-4 py-3 text-gray-600">{p.pricePerKg}</td>
                <td className="px-4 py-3 text-gray-600">{p.availableQty} kg</td>
                <td className="px-4 py-3 text-gray-600">{p.location || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.status === 'active' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleStatus(p)} className="text-xs font-semibold text-primary-600 hover:underline">
                      {p.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(p)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
