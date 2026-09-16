import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import client from '../api/client';

export default function InventoryTab() {
  const [items, setItems] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ laptop_id: '', price_pkr: '', stock: '' });

  async function fetchData() {
    setLoading(true);
    try {
      const [invRes, lapRes] = await Promise.all([
        client.get('/api/inventory/mine'),
        client.get('/api/laptops'),
      ]);
      setItems(invRes.data || []);
      setLaptops(lapRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function resetForm() {
    setForm({ laptop_id: '', price_pkr: '', stock: '' });
    setEditing(null);
    setShowAddForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.laptop_id || !form.price_pkr) {
      toast.error('Please fill laptop and price');
      return;
    }

    try {
      const payload = {
        laptop_id: parseInt(form.laptop_id, 10),
        price_pkr: parseInt(form.price_pkr, 10),
        stock: parseInt(form.stock, 10) || 0,
      };

      if (editing) {
        await client.put(`/api/inventory/${editing.id}`, payload);
        toast.success('Item updated');
      } else {
        await client.post('/api/inventory', payload);
        toast.success('Item added');
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this item?')) return;
    try {
      await client.delete(`/api/inventory/${id}`);
      toast.success('Item deleted');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }

  function handleEdit(item) {
    setEditing(item);
    setForm({
      laptop_id: item.laptop_id,
      price_pkr: item.price_pkr,
      stock: item.stock,
    });
    setShowAddForm(true);
  }

  function getLaptopName(id) {
    const laptop = laptops.find((l) => l.id === id);
    return laptop ? `${laptop.brand} ${laptop.model}` : `Laptop #${id}`;
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
          <h3 style={{ margin: 0 }}>My Inventory ({items.length})</h3>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowAddForm(!showAddForm);
            }}
          >
            {showAddForm ? 'Cancel' : '+ Add Item'}
          </button>
        </div>

        {showAddForm && (
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
                <label>Laptop</label>
                <select
                  value={form.laptop_id}
                  onChange={(e) => setForm({ ...form, laptop_id: e.target.value })}
                  disabled={!!editing}
                  required
                >
                  <option value="">Select laptop...</option>
                  {laptops.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.brand} {l.model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price (PKR)</label>
                <input
                  type="number"
                  value={form.price_pkr}
                  onChange={(e) => setForm({ ...form, price_pkr: e.target.value })}
                  placeholder="e.g., 175000"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="e.g., 5"
                  min="0"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editing ? 'Update Item' : 'Add Item'}
            </button>
          </form>
        )}

        {loading ? (
          <p>Loading inventory...</p>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <h4>No inventory items yet</h4>
            <p>Click "Add Item" to list your first laptop.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Laptop</th>
                <th>Price (PKR)</th>
                <th>Stock</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{getLaptopName(item.laptop_id)}</td>
                  <td className="price-cell">
                    Rs. {item.price_pkr.toLocaleString()}
                  </td>
                  <td>{item.stock}</td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>
                    {new Date(item.updated_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button className="action-btn edit-btn" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
