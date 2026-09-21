import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Users, ShieldCheck, Clock, BadgeCheck, UserX, Phone, Store } from 'lucide-react';
import client from '../api/client';

export default function VendorsTab() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await client.get('/api/admin/vendors');
      setVendors(res.data || []);
    } catch {
      /* handled */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleVerify(vendor) {
    try {
      await client.put(`/api/admin/vendors/${vendor.id}/verify`, {
        is_verified: !vendor.is_verified,
      });
      toast.success(vendor.is_verified ? 'Vendor unverified' : 'Vendor verified');
      load();
    } catch {
      /* handled */
    }
  }

  const verified = vendors.filter((v) => v.is_verified).length;
  const pending = vendors.length - verified;

  const stats = [
    {
      icon: Users,
      label: 'Total Vendors',
      value: vendors.length,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: ShieldCheck,
      label: 'Verified',
      value: verified,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Clock,
      label: 'Pending',
      value: pending,
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <>
      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Vendors table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
          <Store className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-bold text-gray-900">All Vendors</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
            <p className="text-sm text-gray-500">Loading vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm font-semibold text-gray-900">No vendors yet</p>
            <p className="mt-1 text-xs text-gray-500">
              Vendors will appear here once they register.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Shop Name</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vendors.map((v) => (
                  <tr key={v.id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      #{v.id}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {v.User?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {v.shop_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {v.phone ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          {v.phone}
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                          v.is_verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {v.is_verified ? (
                          <>
                            <BadgeCheck className="h-3 w-3" /> Verified
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" /> Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleVerify(v)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition ${
                          v.is_verified
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {v.is_verified ? (
                          <>
                            <UserX className="h-3.5 w-3.5" /> Unverify
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5" /> Verify
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
