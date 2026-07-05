import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, MapPin, User } from 'lucide-react';
import api from '../../api/client.js';
import { useCart } from '../../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) {
    return <p className="py-10 text-center text-gray-400">Loading product...</p>;
  }

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <img
        src={product.imageUrl || 'https://placehold.co/500x400?text=%20'}
        alt={product.name}
        className="h-80 w-full rounded-2xl object-cover"
      />
      <div>
        <p className="text-sm font-medium text-primary-600">{product.category}</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          {product.name} {product.variety && <span className="font-normal text-gray-500">({product.variety})</span>}
        </h1>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          Rs {product.pricePerKg}
          <span className="text-base font-normal text-gray-500"> / kg</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {product.location}
          </span>
          <span className="flex items-center gap-1">
            <User size={14} /> {product.seller?.name}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500">Available: {product.availableQty} kg · {product.listingType}</p>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center rounded-full border border-gray-300">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 text-gray-500 hover:text-gray-900">
              <Minus size={16} />
            </button>
            <span className="w-10 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(product.availableQty, q + 1))} className="p-2.5 text-gray-500 hover:text-gray-900">
              <Plus size={16} />
            </button>
          </div>
          <span className="text-sm text-gray-500">kg</span>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleAdd}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <ShoppingCart size={16} /> {added ? 'Added!' : 'Add to Cart'}
          </button>
          <Link
            to="/buyer/cart"
            onClick={() => addItem(product, qty)}
            className="flex items-center justify-center rounded-full border border-gray-300 px-6 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Buy Now
          </Link>
        </div>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm text-gray-400 hover:text-gray-600">
          ← Back to results
        </button>
      </div>
    </div>
  );
}
