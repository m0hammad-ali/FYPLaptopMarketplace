import { useState, useEffect } from 'react';
import { MapPin, Phone, ArrowLeft, Store, ShieldCheck } from 'lucide-react';
import client from '../api/client';

export default function ShopsTab() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);

  useEffect(() => {
    client
      .get('/api/shops')
      .then((res) => setShops(res.data || []))
      .catch(() => setShops([]))
      .finally(() => setLoading(false));
  }, []);

  if (selectedShop) {
    return <ShopDetail shop={selectedShop} onBack={() => setSelectedShop(null)} />;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">Shops in Gulhaji Plaza</h2>
        <p className="mt-1 text-sm text-gray-500">
          {loading ? 'Loading...' : `${shops.length} shops found`}
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="text-sm text-gray-500">Loading shops...</p>
        </div>
      ) : shops.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
          <Store className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-sm font-semibold text-gray-900">No shops registered yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <button
              key={shop.id}
              onClick={() => setSelectedShop(shop)}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Store className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{shop.name}</h3>
              {shop.address && (
                <p className="mb-1 flex items-start gap-2 text-xs text-gray-600">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400 mt-0.5" />
                  {shop.address}
                </p>
              )}
              {shop.phone && (
                <p className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  {shop.phone}
                </p>
              )}
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                View shop →
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ShopDetail({ shop, onBack }) {
  const [vendors, setVendors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get(`/api/inventory/vendors/${shop.vendor_id}`).catch(() => ({ data: null })),
      client.get('/api/inventory').catch(() => ({ data: [] })),
    ])
      .then(([vendorRes, invRes]) => {
        setVendors(vendorRes.data);
        const filtered = (invRes.data || []).filter((i) => i.vendor_id === shop.vendor_id);
        setInventory(filtered);
      })
      .finally(() => setLoading(false));
  }, [shop.vendor_id]);

  const mapUrl = shop.latitude && shop.longitude
    ? `https://www.google.com/maps?q=${shop.latitude},${shop.longitude}&output=embed`
    : 'https://www.google.com/maps?q=Gulhaji+Plaza+Peshawar&output=embed';

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to shops
      </button>

      {/* Shop header */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8">
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Store className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-gray-900">{shop.name}</h1>
              {vendors?.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
            {shop.address && (
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                {shop.address}
              </p>
            )}
            {shop.phone && (
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                {shop.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <iframe
          title={`Map of ${shop.name}`}
          src={mapUrl}
          width="100%"
          height="350"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>

      {/* Inventory */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          Inventory from this shop ({inventory.length})
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading inventory...</p>
        ) : inventory.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center">
            <p className="text-sm text-gray-500">No items listed by this vendor yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    Laptop #{item.laptop_id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                  </p>
                </div>
                <div className="text-lg font-extrabold text-indigo-600">
                  Rs. {(item.price_pkr || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
