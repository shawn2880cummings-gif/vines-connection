export interface Product {
  id: string;
  name: string;
  author: string;
  description: string;
  price: number; // in cents
  displayPrice: string;
  image: string;
  tags: string[];
  type: "digital" | "paperback" | "bundle";
  // For digital products — filename in /digital-products/ directory
  fileName?: string;
  // For external links (like Lulu paperback)
  externalLink?: string;
  storeName?: string;
}

export const products: Product[] = [
  {
    id: "collapse-recursion-paperback",
    name: "Collapse Recursion: The Logic of Coherence",
    author: "Shawn Cummings",
    description:
      "A systematic framework for identifying and dismantling incoherence at its root. Integrates neuromelanin biology, sacred geometry, and the Enneagram. 531 pages — part research, part philosophy, part operational manual.",
    price: 0, // external link, no Stripe checkout
    displayPrice: "$36.00",
    image:
      "https://assets.lulu.com/cover_thumbs/g/j/gjpe5ee-front-shortedge-384.jpg",
    tags: ["Paperback", "531 Pages", "Philosophy", "Sacred Geometry"],
    type: "paperback",
    externalLink:
      "https://www.barnesandnoble.com/w/collapse-recursion-shawn-cummings/1149520866",
    storeName: "Barnes & Noble",
  },

  // ============================================================
  // ADD YOUR DIGITAL PRODUCTS BELOW
  // Copy this template and fill in your details:
  // ============================================================
  //
  // {
  //   id: "your-product-slug",
  //   name: "Product Title",
  //   author: "Shawn Cummings",
  //   description: "Product description here.",
  //   price: 1999, // $19.99 in cents
  //   displayPrice: "$19.99",
  //   image: "/images/your-cover.jpg", // put image in public/images/
  //   tags: ["Ebook", "PDF"],
  //   type: "digital",
  //   fileName: "your-file.pdf", // put file in digital-products/
  // },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getDigitalProducts(): Product[] {
  return products.filter((p) => p.type === "digital" || p.type === "bundle");
}

export function getAllProducts(): Product[] {
  return products;
}
