import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const AUTH_URL = "http://localhost:3004/login";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/laptops/featured`)
      .then((res) => setFeatured(res.data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700">
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center text-white sm:px-6 md:py-28 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur">
            ✨ AI-powered laptop matching for Gulhaji Plaza
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl">
            Find Your Perfect Laptop
            <br />
            in Gulhaji Plaza
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base text-indigo-100 md:text-lg">
            AI-powered recommendations. Real prices in PKR. Verified vendors.
            Say goodbye to confusing specs and opaque pricing.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`${AUTH_URL}?redirect=customer`}
              className="rounded-xl bg-white px-8 py-4 text-base font-bold text-indigo-600 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Get Recommendations
            </a>
            <a
              href={`${AUTH_URL}?redirect=vendor`}
              className="rounded-xl border-2 border-white/60 px-8 py-4 text-base font-bold text-white transition hover:bg-white/10"
            >
              Vendor Login
            </a>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <div className="text-2xl font-extrabold">120+</div>
              <div className="text-xs uppercase tracking-wide text-indigo-200">
                Laptops in catalog
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <div className="text-2xl font-extrabold">3</div>
              <div className="text-xs uppercase tracking-wide text-indigo-200">
                Verified vendors
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <div className="text-2xl font-extrabold">93%</div>
              <div className="text-xs uppercase tracking-wide text-indigo-200">
                AI Precision@3
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-3 text-3xl font-extrabold md:text-4xl">
              Why LaptopMarket
            </h2>
            <p className="text-gray-600">
              Everything you need to make a confident purchase decision.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                ✨
              </div>
              <h3 className="mb-2 text-lg font-bold">AI-Powered Matching</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Tell us your budget and needs. Our content-based engine ranks
                every laptop to fit you best.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                🔒
              </div>
              <h3 className="mb-2 text-lg font-bold">Real PKR Prices</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Transparent pricing from verified vendors in Gulhaji Plaza. No
                hidden costs, no guesswork.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                💬
              </div>
              <h3 className="mb-2 text-lg font-bold">Direct WhatsApp</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Chat with vendors instantly. Check stock and negotiate before
                you visit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED LAPTOPS */}
      <section id="featured" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-3 text-3xl font-extrabold md:text-4xl">
              Featured Laptops
            </h2>
            <p className="text-gray-600">
              A preview of our catalog. Sign in to see all laptops with
              personalized recommendations.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-center text-gray-500">
              No laptops available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((laptop) => {
                const spec = laptop.Specification || {};
                return (
                  <div
                    key={laptop.id}
                    className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {laptop.brand}
                    </div>
                    <h3 className="mb-3 font-bold text-gray-900">
                      {laptop.model}
                    </h3>
                    <div className="mb-4 text-2xl font-extrabold text-indigo-600">
                      Rs. {(spec.price_pkr || 0).toLocaleString()}
                    </div>
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                        {spec.ram_gb || 8}GB RAM
                      </span>
                      <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                        {spec.storage_gb || 256}GB
                      </span>
                    </div>
                    <a
                      href={`${AUTH_URL}?redirect=customer`}
                      className="mt-auto rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Get Recommendation
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-3 text-3xl font-extrabold md:text-4xl">
              How It Works
            </h2>
            <p className="text-gray-600">
              Three simple steps to your next laptop.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-extrabold text-white shadow-lg">
                1
              </div>
              <h4 className="mb-2 text-lg font-bold">Tell us your needs</h4>
              <p className="text-sm text-gray-600">
                Pick a budget and usage type — takes 30 seconds.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-extrabold text-white shadow-lg">
                2
              </div>
              <h4 className="mb-2 text-lg font-bold">Get ranked matches</h4>
              <p className="text-sm text-gray-600">
                Our AI ranks laptops against your exact preferences.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-extrabold text-white shadow-lg">
                3
              </div>
              <h4 className="mb-2 text-lg font-bold">Contact the vendor</h4>
              <p className="text-sm text-gray-600">
                WhatsApp the shop directly to verify and buy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section id="map" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="mb-3 text-3xl font-extrabold md:text-4xl">
              Visit Gulhaji Plaza
            </h2>
            <p className="text-gray-600">
              Find us in the heart of Peshawar's IT market.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <iframe
              title="Gulhaji Plaza"
              src="https://www.google.com/maps?q=Gulhaji+Plaza+Peshawar&output=embed"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">
            Ready to find your next laptop?
          </h2>
          <p className="mb-8 text-indigo-100">
            Sign in and get personalized recommendations in under 30 seconds.
          </p>
          <a
            href="http://localhost:3004/login?redirect=customer"
            className="inline-block rounded-xl bg-white px-8 py-4 text-base font-bold text-indigo-600 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Get Started Free
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
