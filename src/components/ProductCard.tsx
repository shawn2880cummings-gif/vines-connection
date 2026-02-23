import Image from "next/image";

interface ProductCardProps {
  title: string;
  author: string;
  description: string;
  price: string;
  image: string;
  buyLink: string;
  storeName: string;
  tags?: string[];
}

export default function ProductCard({
  title,
  author,
  description,
  price,
  image,
  buyLink,
  storeName,
  tags = [],
}: ProductCardProps) {
  return (
    <div className="gradient-card group overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02]">
      {/* Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-celestial-800">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
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
          {title}
        </h3>
        <p className="mb-3 text-sm text-text-accent">by {author}</p>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-text-secondary">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-psyche-gold">{price}</span>
          <a
            href={buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-to-r from-psyche-teal to-psyche-gold px-5 py-2 text-sm font-semibold text-celestial-900 transition-transform hover:scale-105"
          >
            Buy on {storeName}
          </a>
        </div>
      </div>
    </div>
  );
}
