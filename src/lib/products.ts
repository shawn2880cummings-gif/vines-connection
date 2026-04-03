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
      "A systematic framework for identifying and dismantling incoherence at its root. Integrates neuromelanin biology, sacred geometry, and the Enneagram. 482 pages — part research, part philosophy, part operational manual.",
    price: 0, // external link, no Stripe checkout
    displayPrice: "$36.00",
    image:
      "https://assets.lulu.com/cover_thumbs/g/j/gjpe5ee-front-shortedge-384.jpg",
    tags: ["Paperback", "482 Pages", "Philosophy", "Sacred Geometry"],
    type: "paperback",
    externalLink:
      "https://www.barnesandnoble.com/w/collapse-recursion-shawn-cummings/1149520866",
    storeName: "Barnes & Noble",
  },

  {
    id: "tao-of-the-observer",
    name: "The Tao of the Observer: The Nine Fold Path",
    author: "Shawn Cummings",
    description:
      "A manual for conscious observation and sovereign governance. Most people move through the world reacting — absorbing every signal, responding to every provocation, governed by every emotion. This work provides a different path.",
    price: 0,
    displayPrice: "$18.00",
    image:
      "https://pe56d.s3.amazonaws.com/o_1jhdf1ck9sr9hik15r81b141fsp1a.png",
    tags: ["Digital", "Enneagram", "Self-Mastery"],
    type: "digital",
    externalLink: "https://payhip.com/b/sH2un",
    storeName: "Payhip",
  },
  {
    id: "collapse-recursion-of-conversation",
    name: "The Collapse Recursion of Conversation",
    author: "Shawn Cummings",
    description:
      "Why everything you were taught about communication is wrong. The conversation you just had today — someone satisfying was controlling its outcome. This free e-book shows you how.",
    price: 0,
    displayPrice: "Free",
    image:
      "https://pe56d.s3.amazonaws.com/o_1jhhgc4g81ee31991itg1vr7aaa1a.png",
    tags: ["Free", "Digital", "Communication"],
    type: "digital",
    externalLink: "https://payhip.com/b/wGaB4",
    storeName: "Payhip",
  },
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
