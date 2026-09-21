import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Store, MapPin, Phone, X } from 'lucide-react';
import client from '../api/client';

export default function ShopsTab() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    latitude: '',
    longitude: '',
  });

  async function load() {
    setLoading(true);
    try {
      const res = await client.get('/api/shops/mine');
      setShops(res.data || []);
    } catch {
      /* handled */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setForm({ name: '', address: '', phone: '', latitude: '', longitude: '' });
    setEditing(null);
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name) {
      toast.error('Shop name is required');
      return;
    }

    try {
      if (editing) {
        await client.put(`/api/shops/${editing.id}`, form);
        toast.success('Shop updated');
      } else {
        await client.post('/api/shops', form);
        toast.success('Shop added');
      }
      resetForm();
      load();
    } catch {
      /* handled */
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this shop?')) return;
    try {
      await client.delete(`/api/shops/${id}`);
      toast.success('Shop deleted');
      load();
    } catch {
      /* handled */
    }
  }

  function handleEdit(shop) {
    setEditing(shop);
    setForm({
      name: shop.name,
      address: shop.address || '',
      phone: shop.phone || '',
      latitude: shop.latitude || '',
      longitude: shop.longitude || '',
    });
    setShowForm(true);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-bold text-gray-900">My Shops ({shops.length})</h3>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
        >
          {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showForm ? 'Cancel' : 'Add Shop'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 border-b border-gray-100 bg-gray-50 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Shop Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ali Computers"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+923001234567"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Address
            </label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows="2"
              placeholder="Gulhaji Plaza, Floor 1, Shop 12, Peshawar"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Latitude (optional)
              </label>
              <input
                type="number"
                step="0.0001"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                placeholder="34.0151"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Longitude (optional)
              </label>
              <input
                type="number"
                step="0.0001"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                placeholder="71.5249"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {editing ? 'Update Shop' : 'Add Shop'}
          </button>
        </form>
      )}

      {/* Shop list */}
      {loading ? (
        <div className="p-8 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="text-sm text-gray-500">Loading shops...</p>
        </div>
      ) : shops.length === 0 ? (
        <div className="p-12 text-center">
          <Store className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-sm font-semibold text-gray-900">No shops added yet</p>
          <p className="mt-1 text-xs text-gray-500">
            Add your physical shop location so customers can find you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          {shops.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-gray-200 p-5 transition hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <h4 className="font-bold text-gray-900">{s.name}</h4>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleEdit(s)}
                    className="rounded-md bg-indigo-50 p-1.5 text-indigo-600 transition hover:bg-indigo-100"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="rounded-md bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {s.address && (
                <p className="mb-1.5 flex items-center gap-2 text-xs text-gray-600">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  {s.address}
                </p>
              )}
              {s.phone && (
                <p className="mb-1.5 flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  {s.phone}
                </p>
              )}
              {s.latitude && s.longitude && (
                <p className="mt-2 font-mono text-xs text-indigo-600">
                  GPS: {Number(s.latitude).toFixed(4)}, {Number(s.longitude).toFixed(4)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
