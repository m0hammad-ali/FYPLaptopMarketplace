import { useState, useEffect } from 'react';
import { ArrowLeft, Cpu, HardDrive, Monitor, Weight, Battery, Zap, MessageCircle, Store, ShieldCheck } from 'lucide-react';
import client from '../api/client';

export default function LaptopDetail({ laptop, onBack }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const spec = laptop.Specification || {};

  useEffect(() => {
    if (!laptop?.id) return;
    setLoading(true);
    client
      .get(`/api/inventory/laptop/${laptop.id}`)
      .then((res) => setVendors(res.data || []))
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  }, [laptop?.id]);

  const contactVendor = async (vendorPhone, price) => {
    try {
      const res = await client.post('/api/notify/whatsapp-link', {
        phone: vendorPhone || '923001234567',
        laptop_brand: laptop.brand,
        laptop_model: laptop.model,
        price_pkr: price,
      });
      window.open(res.data.url, '_blank', 'noopener,noreferrer');
    } catch {
      const fallback = `https://wa.me/923001234567?text=${encodeURIComponent(
        `Hi, I'm interested in the ${laptop.brand} ${laptop.model} for Rs. ${price}.`
      )}`;
      window.open(fallback, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to laptops
      </button>

      {/* Header */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {laptop.brand} — {laptop.category}
        </div>
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900">{laptop.model}</h1>
        <div className="text-3xl font-extrabold text-indigo-600">
          Rs. {(spec.price_pkr || 0).toLocaleString()}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Base reference price. Actual prices vary by vendor below.
        </p>
      </div>

      {/* Specs */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8">
        <h2 className="mb-6 text-xl font-bold text-gray-900">Full Specifications</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SpecItem icon={Cpu} label="Processor" value={spec.cpu_model} />
          <SpecItem
            icon={Zap}
            label="CPU Benchmark"
            value={spec.cpu_benchmark ? spec.cpu_benchmark.toLocaleString() : '—'}
          />
          <SpecItem icon={Monitor} label="Graphics" value={spec.gpu_model} />
          <SpecItem
            icon={Zap}
            label="GPU Benchmark"
            value={spec.gpu_benchmark ? spec.gpu_benchmark.toLocaleString() : '—'}
          />
          <SpecItem icon={HardDrive} label="RAM" value={spec.ram_gb ? `${spec.ram_gb} GB` : '—'} />
          <SpecItem
            icon={HardDrive}
            label="Storage"
            value={spec.storage_gb ? `${spec.storage_gb} GB ${spec.storage_type || ''}` : '—'}
          />
          <SpecItem
            icon={Monitor}
            label="Display"
            value={spec.display_size ? `${spec.display_size}"` : '—'}
          />
          <SpecItem icon={Weight} label="Weight" value={spec.weight_kg ? `${spec.weight_kg} kg` : '—'} />
          <SpecItem
            icon={Battery}
            label="Battery"
            value={spec.battery_wh ? `${spec.battery_wh} Wh` : '—'}
          />
        </div>
      </div>

      {/* Vendors */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <div className="mb-6 flex items-center gap-2">
          <Store className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Available at {vendors.length} vendors
          </h2>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading vendors...</p>
        ) : vendors.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center">
            <p className="text-sm text-gray-500">
              No vendors have listed this laptop yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {vendors.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 p-5 transition hover:shadow-md"
              >
                <div className="flex-1 min-w-[200px]">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">
                      {item.vendor?.shop_name || `Vendor #${item.vendor_id}`}
                    </h3>
                    {item.vendor?.is_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  {item.vendor?.phone && (
                    <p className="text-xs text-gray-500">{item.vendor.phone}</p>
                  )}
                  {item.vendor?.address && (
                    <p className="text-xs text-gray-500">{item.vendor.address}</p>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold text-indigo-600">
                    Rs. {(item.price_pkr || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500">
                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                  </p>
                </div>

                <button
                  onClick={() => contactVendor(item.vendor?.phone, item.price_pkr)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#20BD5A]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Shop
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SpecItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </div>
        <div className="mt-0.5 text-sm font-medium text-gray-900">{value || '—'}</div>
      </div>
    </div>
  );
}
