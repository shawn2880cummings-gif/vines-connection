"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Books & Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-psyche-teal to-psyche-gold">
            <span className="text-lg font-bold text-celestial-900">V</span>
          </div>
          <div>
            <h1
              className="text-lg font-bold tracking-wide text-text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Vines Connection
            </h1>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-text-secondary transition-colors hover:text-psyche-gold"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://payhip.com/VinesConnection"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold px-5 py-2 text-sm font-semibold text-celestial-900 transition-transform hover:scale-105"
          >
            Shop Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-text-primary transition-transform ${isOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-text-primary transition-opacity ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-text-primary transition-transform ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-border bg-bg-primary/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg text-text-secondary transition-colors hover:text-psyche-gold"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://payhip.com/VinesConnection"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold px-5 py-3 text-center font-semibold text-celestial-900"
            >
              Shop Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
