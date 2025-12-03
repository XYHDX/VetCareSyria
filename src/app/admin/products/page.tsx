'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Save, Trash2, Package, Globe2, Landmark, Image as ImageIcon } from 'lucide-react';
import type { Product } from '@/lib/products';

const emptyProduct: Product = {
  id: '',
  name: '',
  partner: '',
  category: '',
  description: '',
  origin: '',
  status: 'available'
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product>(emptyProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const startNew = () => {
    setEditing({ ...emptyProduct, id: crypto.randomUUID() });
    setIsEditing(true);
    setMessage('');
    setError('');
  };

  const startEdit = (product: Product) => {
    setEditing(product);
    setIsEditing(true);
    setMessage('');
    setError('');
  };

  const removeProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const updated = products.filter((p) => p.id !== id);
    await persist(updated, 'Product deleted');
  };

  const persist = async (list: Product[], success: string) => {
    setIsSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list)
      });
      if (!res.ok) throw new Error(await res.text());
      setProducts(list);
      setIsEditing(false);
      setMessage(success);
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      console.error(err);
      setError('Could not save products. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing.name) {
      setError('Name is required');
      return;
    }
    const exists = products.find((p) => p.id === editing.id);
    const updated = exists
      ? products.map((p) => (p.id === editing.id ? editing : p))
      : [...products, editing];
    await persist(updated, 'Products saved');
  };

  return (
    <AdminLayout activePage="products">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-900">Products</h1>
          <p className="text-gray-600">Control partner products shown on the public site</p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-700 text-white px-3 py-2 hover:bg-emerald-800"
        >
          <Plus size={16} /> New product
        </button>
      </div>

      {message && <div className="rounded-md bg-emerald-50 text-emerald-700 px-4 py-2">{message}</div>}
      {error && <div className="rounded-md bg-red-50 text-red-700 px-4 py-2">{error}</div>}

      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(
            products.reduce<Record<string, Product[]>>((acc, p) => {
              const key = p.partner || 'Unassigned';
              acc[key] = acc[key] || [];
              acc[key].push(p);
              return acc;
            }, {})
          ).map(([partner, items]) => (
            <div key={partner} className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                <Landmark size={16} className="text-emerald-700" />
                <span>{partner}</span>
              </div>
              <div className="space-y-2">
                {items.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-md border border-emerald-100 bg-emerald-50/50 p-3 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-emerald-700" />
                        <h3 className="text-base font-semibold text-emerald-900">{product.name}</h3>
                      </div>
                      {product.description && <p className="text-sm text-gray-600 mt-1">{product.description}</p>}
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-emerald-800">
                        {product.category && <span className="rounded-full bg-emerald-100 px-2 py-1">{product.category}</span>}
                        {product.origin && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-1 text-sky-800">
                            <Globe2 size={12} />
                            {product.origin}
                          </span>
                        )}
                        {product.status && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700 capitalize">
                            {product.status.replace('-', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="text-emerald-700 hover:text-emerald-900 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="text-red-600 hover:text-red-700 text-sm inline-flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="rounded-lg border border-dashed border-emerald-200 bg-white p-6 text-center text-gray-600">
              No products yet. Click “New product” to add your first item.
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white border border-emerald-100 rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Partner</label>
            <input
              type="text"
              value={editing.partner || ''}
              onChange={(e) => setEditing({ ...editing, partner: e.target.value })}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={editing.category || ''}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Origin</label>
              <input
                type="text"
                value={editing.origin || ''}
                onChange={(e) => setEditing({ ...editing, origin: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-emerald-200 focus:border-emerald-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={editing.status}
              onChange={(e) => setEditing({ ...editing, status: e.target.value as Product['status'] })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-emerald-200 focus:border-emerald-400"
            >
              <option value="available">Available</option>
              <option value="out-of-stock">Out of stock</option>
              <option value="coming-soon">Coming soon</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              value={editing.origin || ''}
              onChange={(e) => setEditing({ ...editing, origin: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-emerald-200 focus:border-emerald-400"
              placeholder="https://partner-website.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editing.description || ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-700 text-white px-4 py-2 hover:bg-emerald-800 disabled:opacity-60"
            >
              <Save size={16} /> {isSaving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
};

export default ProductsPage;
