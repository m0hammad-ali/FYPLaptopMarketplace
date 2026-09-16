import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const AUTH_URL = 'http://localhost:3004/login';

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
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">LaptopMarket</div>
          <nav className="menu">
            <a href="#features">Features</a>
            <a href="#featured">Laptops</a>
            <a href="#how">How it works</a>
            <button
              className="login-btn"
              onClick={() => (window.location.href = `${AUTH_URL}?redirect=customer`)}
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <h1>Find Your Perfect Laptop in Gulhaji Plaza</h1>
        <p>
          AI-powered recommendations. Real prices in PKR. Verified vendors. Say goodbye to
          confusing specs and opaque pricing.
        </p>
        <div className="hero-cta">
          <button
            className="btn-hero-primary"
            onClick={() => (window.location.href = `${AUTH_URL}?redirect=customer`)}
          >
            Get Recommendations
          </button>
          <button
            className="btn-hero-secondary"
            onClick={() => (window.location.href = `${AUTH_URL}?redirect=vendor`)}
          >
            Vendor Login
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="feature-card">
          <div className="feature-emoji">🎯</div>
          <h3>AI-Powered Matching</h3>
          <p>
            Tell us your budget and usage. Our content-based engine finds the laptops that fit
            you best.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-emoji">💰</div>
          <h3>Real PKR Prices</h3>
          <p>
            Transparent pricing from verified vendors in Gulhaji Plaza. No more hidden costs or
            guesswork.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-emoji">💬</div>
          <h3>Direct WhatsApp Contact</h3>
          <p>
            Chat with the vendor instantly. Verify stock and negotiate the price before you
            visit.
          </p>
        </div>
      </section>

      {/* Featured Laptops */}
      <section className="section" id="featured">
        <h2 className="section-title">Featured Laptops</h2>
        <p className="section-subtitle">
          A preview of our catalog. Login to see all laptops with recommendations.
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</p>
        ) : featured.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            No laptops available yet.
          </p>
        ) : (
          <div className="grid">
            {featured.map((laptop) => {
              const spec = laptop.Specification || {};
              return (
                <div key={laptop.id} className="laptop-card">
                  <div className="laptop-brand">{laptop.brand}</div>
                  <div className="laptop-model">{laptop.model}</div>
                  <div className="laptop-price">
                    Rs. {(spec.price_pkr || 0).toLocaleString()}
                  </div>
                  <div className="laptop-specs">
                    <span className="spec-chip">{spec.cpu_benchmark ? 'Fast CPU' : 'CPU'}</span>
                    <span className="spec-chip">{spec.ram_gb}GB RAM</span>
                    <span className="spec-chip">{spec.storage_gb}GB</span>
                  </div>
                  <button
                    className="laptop-cta"
                    onClick={() => (window.location.href = `${AUTH_URL}?redirect=customer`)}
                  >
                    Get Recommendation
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="how-section" id="how">
        <div className="how-inner">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to your next laptop.</p>

          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Tell us your needs</h4>
              <p>Pick a budget and usage. Take 30 seconds.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Get ranked matches</h4>
              <p>Our AI ranks every laptop against your preferences.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Contact the vendor</h4>
              <p>WhatsApp the shop directly to check stock and price.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <h5>LaptopMarket</h5>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
          <div>
            <h5>Quick Links</h5>
            <a href={`${AUTH_URL}?redirect=customer`}>Customer Login</a>
            <a href={`${AUTH_URL}?redirect=vendor`}>Vendor Login</a>
            <a href={`${AUTH_URL}?redirect=admin`}>Admin</a>
          </div>
          <div>
            <h5>Location</h5>
            <a href="#">Gulhaji Plaza, Peshawar</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Laptop Marketplace — Final Year Project, The University of Agriculture, Peshawar
        </div>
      </footer>
    </div>
  );
}
