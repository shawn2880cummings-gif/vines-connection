import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { AnimatedSection } from "@/components/ui/animated-section";


export const metadata: Metadata = {
  title: `Research Foundation | ${APP_NAME}`,
  description:
    "Explore PAAN's published research on MC1R Genetics, Melanin Biochemistry, Neuromelanin Function, and Collapse Recursion Theory.",
};

const papers = [
  {
    title: "MC1R: THE FUNCTIONAL AXIS OF LIFE — A Cross-Kingdom Analysis of Melanocortin-Mediated Protection, Adaptation, and Biological Classification",
    doi: "10.5281/zenodo.18704950",
  },
  {
    title: "The Melanin Code: The Universal Carbon Substrate of Biology and Geology",
    doi: "10.5281/zenodo.18246355",
  },
  {
    title: "The Photobiology and Biochemistry of Pheomelanin: A Comprehensive Analysis of Pigmentary Mechanisms, Genetic Regulation, and Evolutionary Adaptation",
    doi: "10.5281/zenodo.18244187",
  },
  {
    title: "Serotonin: From Peripheral Mechanic to the Melanin Circuit",
    doi: "10.5281/zenodo.18211162",
  },
  {
    title: "The Black Substrate: A Comprehensive Analysis of the History, Origins, and Function of Neuromelanin",
    doi: "10.5281/zenodo.18211503",
  },
  {
    title: "A Report on the Foundational, Psychological, and Alternative Interpretations of Serum Melatonin",
    doi: "10.5281/zenodo.18207318",
  },
  {
    title: "The Coherent Being: A Synthesis of Human Biofield Science, Neurophysiology of Bliss, and Subtle Energy Geometry",
    doi: "10.5281/zenodo.18198449",
  },
  {
    title: "The Primordial Survey: A Comparative Analysis of the Shan Hai Jing and Global Mythic Cosmographies",
    doi: "10.5281/zenodo.18181186",
  },
];

const publishedBooks = [
  {
    title: "Collapse Recursion: The Logic of Coherence",
    details: "531 pages | LCCN 2026903595 | ISBN 9798994854402",
    description:
      "The foundational text of Collapse Recursion Theory. This comprehensive work establishes the theoretical framework connecting quantum observation, biological recursion, and the coherence patterns underlying consciousness and identity.",
  },
  {
    title: "The Tao of the Observer: The Nine Fold Path",
    description:
      "An exploration of the observer's role in the recursive collapse of reality, bridging Eastern contemplative traditions with modern frameworks of consciousness and coherence.",
  },
  {
    title: "The Collapse Recursion of Conversation",
    description:
      "An educational work examining how recursive collapse patterns manifest in dialogue, language, and the relational exchange between observers. This work extends Collapse Recursion Theory into the domain of communication and collective meaning-making.",
  },
];

const researchAreas = [
  {
    title: "MC1R Genetics",
    description:
      "Investigation into the melanocortin 1 receptor gene and its role in melanin production, phenotypic expression, and biological identity.",
  },
  {
    title: "Melanin Biochemistry",
    description:
      "Research into the biochemical properties of melanin, its functions beyond pigmentation, and its significance in biological systems.",
  },
  {
    title: "Neuromelanin Function",
    description:
      "Study of neuromelanin in the central nervous system, its protective and regulatory roles, and its connection to neurological coherence.",
  },
  {
    title: "Collapse Recursion Theory",
    description:
      "The ministry's core theoretical framework examining recursive observation-collapse patterns across quantum, biological, and social systems.",
  },
];

export default function ResearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="sacred-pattern border-b bg-paan-green py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-paan-cream sm:text-5xl">
            Research Foundation
          </h1>
          <div className="divider-gold mx-auto mt-6 w-24" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-paan-sand">
            Scholarship rooted in biological truth and divine order
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 bg-background py-16">
        <div className="container mx-auto max-w-4xl space-y-12 px-4">
          {/* Academic Credentials */}
          <AnimatedSection>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-2xl text-paan-green">
                Academic Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Research by{" "}
                <strong className="text-foreground">
                  Chief Minister Shawn Cummings
                </strong>
                . All works are published and archived through{" "}
                <strong className="text-foreground">
                  CERN&apos;s Zenodo repository
                </strong>
                .
              </p>
              <div className="rounded-lg border border-paan-gold/20 bg-paan-cream/30 px-5 py-4 text-sm">
                <span className="font-medium text-foreground">
                  View all published works on ORCID:{" "}
                </span>
                <a
                  href="https://orcid.org/0009-0006-4312-526X"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paan-green underline underline-offset-4 hover:text-paan-gold"
                >
                  orcid.org/0009-0006-4312-526X
                </a>
              </div>
            </CardContent>
          </Card>
          </AnimatedSection>

          {/* Published Papers */}
          <AnimatedSection>
          <section>
            <h2 className="mb-6 text-2xl font-bold text-paan-green">
              Published Papers
            </h2>
            <Card className="card-hover">
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {papers.map((paper) => (
                    <li
                      key={paper.doi}
                      className="flex items-start gap-3 text-foreground leading-snug"
                    >
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-paan-gold" />
                      <div>
                        <span>{paper.title}</span>
                        <a
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-sm text-paan-green underline underline-offset-4 hover:text-paan-gold"
                        >
                          DOI: {paper.doi}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t">
                  <a
                    href="https://orcid.org/0009-0006-4312-526X"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      View All on ORCID
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>
          </AnimatedSection>

          {/* Published Works (Books) */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-paan-green">
              Published Works
            </h2>
            <p className="mb-6 text-muted-foreground">
              Books by Chief Minister Shawn Cummings (writing as Vine)
            </p>
            <div className="space-y-6">
              {publishedBooks.map((book, i) => (
                <AnimatedSection key={book.title} delay={i * 100}>
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">
                      {book.title}
                    </CardTitle>
                    {book.details && (
                      <p className="text-sm text-muted-foreground">
                        {book.details}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {book.description}
                    </p>
                  </CardContent>
                </Card>
                </AnimatedSection>
              ))}
            </div>
          </section>

          {/* Research Areas */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-paan-green">
              Research Areas
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {researchAreas.map((area, i) => (
                <AnimatedSection key={area.title} delay={i * 100}>
                <Card className="card-hover h-full">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      {area.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {area.description}
                    </p>
                  </CardContent>
                </Card>
                </AnimatedSection>
              ))}
            </div>
          </section>

          {/* Evidentiary Archive */}
          <AnimatedSection>
          <section>
            <div className="rounded-lg border-2 border-paan-gold/40 bg-paan-green/5 px-6 py-8 transition-all duration-300 hover:border-paan-gold/70 hover:shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-paan-green">
                    Primary Source Documentary Evidence
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    with Expert Authentication
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    A living evidentiary archive of authenticated primary source documents
                    — imperial inventories, congressional records, SEC filings, court
                    decisions, census records, and treaty texts — substantiating the
                    foundational historical claims of this Ministry.
                  </p>
                </div>
                <div className="shrink-0">
                  <Link href="/research/primary-source-evidence">
                    <Button className="w-full sm:w-auto">
                      Access Archive
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          </AnimatedSection>

        </div>
      </main>
    </div>
  );
}
