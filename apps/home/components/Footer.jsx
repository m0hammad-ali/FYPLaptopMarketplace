import { Laptop, Mail, MapPin, Phone, Globe, MessageSquare, Youtube, Github } from 'lucide-react';

const AUTH_URL = 'http://localhost:3004/login';

export default function Footer() {
  const columns = [
    {
      title: 'Marketplace',
      links: [
        { label: 'Browse All Laptops', href: `${AUTH_URL}?redirect=customer` },
        { label: 'AI Recommendations', href: '#features' },
        { label: 'Featured Models', href: '#featured' },
        { label: 'Compare Laptops', href: '#' },
        { label: 'Become a Vendor', href: `${AUTH_URL}?redirect=vendor` },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'How It Works', href: '#how' },
        { label: 'Contact a Vendor', href: '#featured' },
        { label: 'Report an Issue', href: '#' },
        { label: 'WhatsApp Support', href: '#' },
      ],
    },
    {
      title: 'Legal & Trust',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Verified Vendors', href: '#' },
        { label: 'Refund Policy', href: '#' },
        { label: 'Anti-Hoarding Policy', href: '#' },
      ],
    },
  ];

  const socials = [
    { icon: Globe, label: 'Website', href: '#' },
    { icon: MessageSquare, label: 'Community', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
    { icon: Github, label: 'GitHub', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2 font-extrabold text-white">
              <Laptop className="h-6 w-6 text-indigo-400" />
              <span className="text-lg">LaptopMarket</span>
            </div>
            <p className="mb-5 text-sm leading-relaxed">
              AI-powered laptop recommendations and a verified marketplace for Gulhaji Plaza, Peshawar.
            </p>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-indigo-400" />
                <span>Gulhaji Plaza, Peshawar, KP</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-indigo-400" />
                <span>hello@laptopmarket.pk</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-indigo-400" />
                <span>+92 300 1234567</span>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 transition hover:bg-indigo-600"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm transition hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-xs md:flex-row">
          <p>© 2026 Laptop Marketplace. Built for The University of Agriculture, Peshawar.</p>
          <p className="text-gray-500">Final Year Project — Muhammad Ali &amp; Sajid Shah</p>
        </div>
      </div>
    </footer>
  );
}
