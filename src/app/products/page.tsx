import type { Metadata } from "next";
import Image from "next/image";
import BuyButton from "@/components/BuyButton";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Books & Products | Vines Connection",
  description:
    "Browse books and digital products by Shawn Cummings. Collapse Recursion, guides, and more.",
};

export default function ProductsPage() {
  const allProducts = getAllProducts();
  const books = allProducts.filter(
    (p) => p.type === "paperback" || p.tags.some((t) => t.includes("Pages"))
  );
  const digital = allProducts.filter(
    (p) => p.type === "digital" || p.type === "bundle"
  );

  return (
    <>
      {/* Header */}
      <section className="gradient-hero relative overflow-hidden py-24">
        <div className="orb left-[5%] top-[20%] h-48 w-48 bg-psyche-violet/20" />
        <div
          className="orb right-[10%] bottom-[10%] h-56 w-56 bg-psyche-gold/15"
          style={{ animationDelay: "4s" }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <span className="mb-4 inline-block text-sm tracking-widest text-psyche-teal uppercase">
            Catalog
          </span>
          <h1
            className="mb-6 text-5xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Books & Digital Products
          </h1>
          <p className="text-lg text-text-secondary">
            Frameworks for coherence. Tools for recursive self-discovery.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          {/* Books section */}
          {books.length > 0 && (
            <>
              <div className="mb-6">
                <h2
                  className="mb-2 text-2xl font-bold text-text-primary"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Books
                </h2>
                <div className="mb-8 h-1 w-20 rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal" />
              </div>

              <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {books.map((product) => (
                  <div
                    key={product.id}
                    className="gradient-card group overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-celestial-800">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      {product.tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {product.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-celestial-700/50 px-3 py-1 text-xs text-psyche-teal"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3
                        className="mb-1 text-xl font-bold text-text-primary"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {product.name}
                      </h3>
                      <p className="mb-3 text-sm text-text-accent">
                        by {product.author}
                      </p>
                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-psyche-gold">
                          {product.displayPrice}
                        </span>
                        <BuyButton
                          productId={product.id}
                          displayPrice={product.displayPrice}
                          type={product.type}
                          externalLink={product.externalLink}
                          storeName={product.storeName}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Digital Products section */}
          <div className="mb-6">
            <h2
              className="mb-2 text-2xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Digital Products
            </h2>
            <div className="mb-8 h-1 w-20 rounded-full bg-gradient-to-r from-psyche-teal to-psyche-magenta" />
          </div>

          {digital.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {digital.map((product) => (
                <div
                  key={product.id}
                  className="gradient-card group overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02]"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-celestial-800">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    {product.tags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-celestial-700/50 px-3 py-1 text-xs text-psyche-teal"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3
                      className="mb-1 text-xl font-bold text-text-primary"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {product.name}
                    </h3>
                    <p className="mb-3 text-sm text-text-accent">
                      by {product.author}
                    </p>
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-psyche-gold">
                        {product.displayPrice}
                      </span>
                      <BuyButton
                        productId={product.id}
                        displayPrice={product.displayPrice}
                        type={product.type}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="gradient-card flex flex-col items-center rounded-2xl p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-celestial-700/50">
                <svg
                  className="h-8 w-8 text-psyche-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3
                className="mb-3 text-xl font-bold text-text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Digital Products Coming Soon
              </h3>
              <p className="mb-6 max-w-md text-text-secondary">
                Ebooks, guides, worksheets, and companion materials are being
                prepared. Check back soon or visit the Payhip store.
              </p>
              <a
                href="https://payhip.com/VinesConnection"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold px-6 py-3 font-semibold text-celestial-900 transition-transform hover:scale-105"
              >
                Visit Payhip Store
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
