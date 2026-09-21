import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Package, X } from 'lucide-react';
import client from '../api/client';

export default function InventoryTab() {
  const [items, setItems] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ laptop_id: '', price_pkr: '', stock: '' });

  async function load() {
    setLoading(true);
    try {
      const [invRes, lapRes] = await Promise.all([
        client.get('/api/inventory/mine'),
        client.get('/api/laptops'),
      ]);
      setItems(invRes.data || []);
      setLaptops(lapRes.data || []);
    } catch {
      /* handled by interceptor */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setForm({ laptop_id: '', price_pkr: '', stock: '' });
    setEditing(null);
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.laptop_id || !form.price_pkr) {
      toast.error('Please fill laptop and price');
      return;
    }

    const payload = {
      laptop_id: parseInt(form.laptop_id, 10),
      price_pkr: parseInt(form.price_pkr, 10),
      stock: parseInt(form.stock, 10) || 0,
    };

    try {
      if (editing) {
        await client.put(`/api/inventory/${editing.id}`, payload);
        toast.success('Item updated');
      } else {
        await client.post('/api/inventory', payload);
        toast.success('Item added');
      }
      resetForm();
      load();
    } catch {
      /* handled */
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this item?')) return;
    try {
      await client.delete(`/api/inventory/${id}`);
      toast.success('Item deleted');
      load();
    } catch {
      /* handled */
    }
  }

  function handleEdit(item) {
    setEditing(item);
    setForm({
      laptop_id: item.laptop_id,
      price_pkr: item.price_pkr,
      stock: item.stock,
    });
    setShowForm(true);
  }

  function getLaptopName(id) {
    const laptop = laptops.find((l) => l.id === id);
    return laptop ? `${laptop.brand} ${laptop.model}` : `Laptop #${id}`;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-bold text-gray-900">
            My Inventory ({items.length})
          </h3>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
        >
          {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border-b border-gray-100 bg-gray-50 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Laptop
              </label>
              <select
                value={form.laptop_id}
                disabled={!!editing}
                onChange={(e) => setForm({ ...form, laptop_id: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-gray-100"
              >
                <option value="">Select laptop...</option>
                {laptops.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.brand} {l.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Price (PKR)
              </label>
              <input
                type="number"
                value={form.price_pkr}
                onChange={(e) => setForm({ ...form, price_pkr: e.target.value })}
                placeholder="175000"
                min="0"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Stock
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="5"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {editing ? 'Update Item' : 'Add Item'}
          </button>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="text-sm text-gray-500">Loading inventory...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center">
          <Package className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-sm font-semibold text-gray-900">No inventory items yet</p>
          <p className="mt-1 text-xs text-gray-500">
            Click "Add Item" to list your first laptop.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Laptop</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Updated</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="transition hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {getLaptopName(item.laptop_id)}
                  </td>
                  <td className="px-6 py-4 font-bold text-indigo-600">
                    Rs. {item.price_pkr.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.stock}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-md bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-md bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
