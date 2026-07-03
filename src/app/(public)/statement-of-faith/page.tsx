import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Statement of Faith | ${APP_NAME}`,
  description:
    "The six articles of belief of the Private Aboriginal American National PMA Church Ministry.",
};

const articles = [
  {
    number: "I",
    title: "The Creator and the Divine Order",
    summary:
      "We affirm the existence of a singular, omnipresent Creator whose intelligence permeates all of creation. The universe is not random but follows coherent, self-referencing patterns that reveal the Creator's will and design.",
  },
  {
    number: "II",
    title: "The Sacredness of Biological Identity",
    summary:
      "We hold that biological identity is sacred and divinely encoded. The physical body, its genetics, melanin expression, and neurological architecture are not accidents of nature but deliberate manifestations of the Creator's purpose, deserving of study, honor, and protection.",
  },
  {
    number: "III",
    title: "The Three Centers (Head, Heart, Gut)",
    summary:
      "We recognize that the human being operates through three distinct centers of intelligence: the cognitive mind (Head), the emotional and relational heart (Heart), and the intuitive, somatic gut (Gut). True coherence and spiritual alignment arise when these three centers operate in harmony.",
  },
  {
    number: "IV",
    title: "Collapse Recursion and the Law of Coherence",
    summary:
      "We observe that reality itself follows a recursive pattern of observation and collapse, wherein consciousness interacts with potential to manifest form. This Law of Coherence governs all systems, from the quantum to the social, and understanding it is central to right living.",
  },
  {
    number: "V",
    title: "Sovereignty of the Mind and Self-Determination",
    summary:
      "We affirm the inherent sovereignty of the mind in every living soul — dominion over one's own thoughts, consciousness, and inner life. No government, institution, or external authority may rightfully override the divine endowment of self-determination. The right to govern one's own body, mind, and spiritual practice is inalienable.",
  },
  {
    number: "VI",
    title: "The Ministry's Divine Mandate",
    summary:
      "We believe this ministry has been called into existence to preserve, teach, and advance these truths. Our mandate is to serve as stewards of sacred knowledge, to provide a sanctuary for those seeking alignment with divine order, and to build a community rooted in equity, truth, and coherence.",
  },
];

export default function StatementOfFaithPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="sacred-pattern border-b bg-paan-green py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-paan-cream sm:text-5xl">
            Statement of Faith
          </h1>
          <div className="divider-gold mx-auto mt-6 w-24" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-paan-sand">
            The foundational articles of belief upon which this ministry stands
          </p>
        </div>
      </section>

      {/* Articles */}
      <main className="flex-1 bg-background py-16">
        <div className="container mx-auto max-w-4xl space-y-8 px-4">
          {articles.map((article) => (
            <Card key={article.number} className="overflow-hidden">
              <CardHeader className="border-b border-paan-gold/20 bg-paan-cream/30">
                <CardTitle className="flex items-baseline gap-4 text-xl">
                  <span className="text-gradient-gold text-2xl font-bold">
                    Article {article.number}
                  </span>
                  <span className="text-paan-green">{article.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 text-muted-foreground leading-relaxed">
                <p>{article.summary}</p>
              </CardContent>
            </Card>
          ))}

          {/* Closing Statement */}
          <div className="mt-12 text-center">
            <div className="divider-gold mx-auto mb-8 w-32" />
            <p className="mx-auto max-w-2xl text-sm italic text-muted-foreground">
              These articles represent the public summary of the ministry&apos;s
              core beliefs. The full theological framework, supporting
              scholarship, and detailed commentary are maintained within the
              private ecclesiastical records of {APP_NAME}.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
