import { useEffect, useState } from 'react';
import api from '../../api/client.js';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500">{products.length} active marketplace listings</p>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
