export type Presentation = {
  slug: string;
  title: string;
  subtitle?: string;
  year?: string;
  tags?: string[];
  dir: string; // public path to the slide images
  slideCount: number;
};

export const presentations: Presentation[] = [
  {
    slug: "eumelanin-standard",
    title: "The Eumelanin Standard",
    subtitle:
      "Biological Electromagnetism and the Master Circuitry of the Human Biofield",
    year: "2026",
    tags: ["Biofield", "Neuromelanin", "Research"],
    dir: "/presentations/eumelanin-standard",
    slideCount: 15,
  },
];

export function getPresentation(slug: string): Presentation | undefined {
  return presentations.find((p) => p.slug === slug);
}

export function slideUrls(p: Presentation): string[] {
  return Array.from(
    { length: p.slideCount },
    (_, i) => `${p.dir}/slide-${String(i + 1).padStart(2, "0")}.jpg`
  );
}
