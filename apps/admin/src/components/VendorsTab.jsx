import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import client from '../api/client';

export default function VendorsTab() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchVendors() {
    setLoading(true);
    try {
      const res = await client.get('/api/admin/vendors');
      setVendors(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVendors();
  }, []);

  async function handleVerify(vendor) {
    try {
      await client.put(`/api/admin/vendors/${vendor.id}/verify`, {
        is_verified: !vendor.is_verified,
      });
      toast.success(vendor.is_verified ? 'Vendor unverified' : 'Vendor verified');
      fetchVendors();
    } catch (err) {
      console.error(err);
    }
  }

  const verified = vendors.filter((v) => v.is_verified).length;
  const pending = vendors.length - verified;

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Vendors</div>
          <div className="stat-value">{vendors.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Verified</div>
          <div className="stat-value verified">{verified}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value pending">{pending}</div>
        </div>
      </div>

      <div className="card">
        <h3>All Vendors</h3>

        {loading ? (
          <p>Loading...</p>
        ) : vendors.length === 0 ? (
          <div className="empty-state">
            <p>No vendors registered yet.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Shop Name</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.User?.email || 'N/A'}</td>
                  <td>{v.shop_name || 'N/A'}</td>
                  <td>{v.phone || 'N/A'}</td>
                  <td>
                    <span className={`badge ${v.is_verified ? 'badge-verified' : 'badge-pending'}`}>
                      {v.is_verified ? '✓ Verified' : '⏳ Pending'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`action-btn ${v.is_verified ? 'btn-unverify' : 'btn-verify'}`}
                      onClick={() => handleVerify(v)}
                    >
                      {v.is_verified ? 'Unverify' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
