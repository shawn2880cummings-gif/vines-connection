import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Coverflow from "@/components/cinematic/Coverflow";
import {
  getPresentation,
  presentations,
  slideUrls,
} from "@/lib/presentations";

export function generateStaticParams() {
  return presentations.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPresentation(slug);
  if (!p) return { title: "Presentation | Vines Connection" };
  return {
    title: `${p.title} | Vines Connection`,
    description: p.subtitle,
  };
}

export default async function PresentationViewer({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const presentation = getPresentation(slug);
  if (!presentation) notFound();

  const slides = slideUrls(presentation);

  return (
    <div className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto mb-10 max-w-4xl text-center">
        <Link
          href="/presentations"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-psyche-teal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          All Presentations
        </Link>
        <h1
          className="text-3xl font-bold text-text-primary md:text-5xl [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {presentation.title}
        </h1>
        {presentation.subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-text-secondary [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
            {presentation.subtitle}
          </p>
        )}
      </div>

      <Coverflow slides={slides} />
    </div>
  );
}
