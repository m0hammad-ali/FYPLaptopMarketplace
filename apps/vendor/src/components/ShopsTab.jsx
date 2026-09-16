import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
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

  async function fetchShops() {
    setLoading(true);
    try {
      const res = await client.get('/api/shops/mine');
      setShops(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchShops();
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
      fetchShops();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this shop?')) return;
    try {
      await client.delete(`/api/shops/${id}`);
      toast.success('Shop deleted');
      fetchShops();
    } catch (err) {
      console.error(err);
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
    <div>
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <h3 style={{ margin: 0 }}>My Shops ({shops.length})</h3>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Cancel' : '+ Add Shop'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#f9fafb',
              padding: 20,
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <div className="form-row">
              <div className="form-group">
                <label>Shop Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ali Computers"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+923001234567"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows="2"
                placeholder="Gulhaji Plaza, Floor 1, Shop 12, Peshawar"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitude (optional)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  placeholder="34.0151"
                />
              </div>

              <div className="form-group">
                <label>Longitude (optional)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                  placeholder="71.5249"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editing ? 'Update Shop' : 'Add Shop'}
            </button>
          </form>
        )}

        {loading ? (
          <p>Loading shops...</p>
        ) : shops.length === 0 ? (
          <div className="empty-state">
            <h4>No shops added yet</h4>
            <p>Add your physical shop location so customers can find you.</p>
          </div>
        ) : (
          <div>
            {shops.map((shop) => (
              <div key={shop.id} className="shop-card">
                <h4>{shop.name}</h4>
                {shop.address && <p>📍 {shop.address}</p>}
                {shop.phone && <p>📞 {shop.phone}</p>}
                {shop.latitude && shop.longitude && (
                  <p className="coords">
                    GPS: {shop.latitude.toFixed(4)}, {shop.longitude.toFixed(4)}
                  </p>
                )}
                <div style={{ marginTop: 12 }}>
                  <button className="action-btn edit-btn" onClick={() => handleEdit(shop)}>
                    Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(shop.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
