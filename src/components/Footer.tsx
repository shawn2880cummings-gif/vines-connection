import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-celestial-900/80">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/vines-logo.jpg"
                alt="Vines Connection"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span
                className="text-lg font-bold text-text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Vines Connection
              </span>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">
              Bridging neuromelanin biology, sacred geometry, and recursive
              intelligence. Books and digital products for coherent
              self-discovery.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-widest text-psyche-gold uppercase">
              Navigate
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-text-secondary hover:text-text-primary"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-sm text-text-secondary hover:text-text-primary"
              >
                Books & Products
              </Link>
              <Link
                href="/about"
                className="text-sm text-text-secondary hover:text-text-primary"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm text-text-secondary hover:text-text-primary"
              >
                Contact
              </Link>
              <Link
                href="/university"
                className="text-sm text-text-secondary hover:text-text-primary"
              >
                Etheric University
              </Link>
            </div>
          </div>

          {/* Storefronts */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-widest text-psyche-gold uppercase">
              Shop
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://payhip.com/VinesConnection"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-psyche-teal"
              >
                Payhip Store &rarr;
              </a>
              <a
                href="https://www.barnesandnoble.com/w/collapse-recursion-shawn-cummings/1149520866"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-psyche-teal"
              >
                Barnes &amp; Noble &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} Vines Connection &mdash; Shawn
            Cummings. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
