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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allProducts.map((product) => (
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
        </div>
      </section>
    </>
  );
}
