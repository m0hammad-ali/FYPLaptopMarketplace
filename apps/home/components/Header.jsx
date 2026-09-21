import { useState } from 'react';
import { Menu, X, Laptop, LogIn } from 'lucide-react';

const AUTH_URL = 'http://localhost:3004/login';

export default function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#featured', label: 'Laptops' },
    { href: '#how', label: 'How it Works' },
    { href: '#map', label: 'Visit Us' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 font-extrabold text-indigo-600">
            <Laptop className="h-6 w-6" />
            <span className="text-lg">LaptopMarket</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-700 transition hover:text-indigo-600"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`${AUTH_URL}?redirect=vendor`}
              className="text-sm font-semibold text-gray-700 transition hover:text-indigo-600"
            >
              Sell on LaptopMarket
            </a>
            <a
              href={`${AUTH_URL}?redirect=customer`}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="p-2 text-gray-700 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={`${AUTH_URL}?redirect=customer`}
                className="mt-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Sign In
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
