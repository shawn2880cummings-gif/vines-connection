import type { Metadata } from "next";
import LeadMagnet, { GROUPS } from "@/components/LeadMagnet";

export const metadata: Metadata = {
  title: "Free Ebook | The Collapse Recursion of Conversation",
  description:
    "Get the free ebook, The Collapse Recursion of Conversation, plus the weekly recursive-clarity letter from Vines Connection.",
};

export default function FreeEbookPage() {
  return (
    <div className="min-h-screen px-6 pt-32 pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="section-index">// Free Download</span>
        <h1
          className="mt-4 mb-6 text-4xl font-bold text-text-primary md:text-6xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          The Collapse Recursion <span className="gradient-text">of Conversation</span>
        </h1>
        <p className="mx-auto max-w-xl text-lg text-text-secondary">
          A free ebook on how meaning collapses and re-forms in dialogue. Enter
          your email and it lands in your inbox.
        </p>
      </div>

      <LeadMagnet
        groupId={GROUPS.ebook}
        heading={<>Send me the <span className="text-psyche-gold font-medium">free ebook</span></>}
      />
    </div>
  );
}
