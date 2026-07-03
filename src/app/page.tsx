import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ScrollText,
  Scale,
  Sparkles,
  Heart,
  Brain,
  Orbit,
  Crown,
  Church,
  ExternalLink,
  ArrowRight,
  HandHeart,
  Globe,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { MobileNav } from "@/components/mobile-nav";
import { DonationForm } from "@/components/donation-form";
import { AnimatedSection } from "@/components/ui/animated-section";
import { DeclarationSection } from "@/components/declaration-section";
import { PresentationViewer } from "@/components/presentation-viewer";
import { SlideGallery } from "@/components/slide-gallery";
import { CinematicBackground } from "@/components/cinematic/cinematic-background";
import { HeroBanner } from "@/components/cinematic/hero-banner";
import { TiltCard } from "@/components/cinematic/tilt-card";

const statementArticles = [
  {
    icon: Sparkles,
    title: "The Creator and the Divine Order",
    summary:
      "There exists a supreme creative force — the source of all natural law, coherence, and biological expression. All authority flows from this divine origin.",
  },
  {
    icon: Heart,
    title: "The Sacredness of Biological Identity",
    summary:
      "Biological identity is a sacred endowment. The melanin system and MC1R-functional expression are divine instruments of coherence, not social constructs.",
  },
  {
    icon: Brain,
    title: "The Three Centers (Head, Heart, Gut)",
    summary:
      "The human being operates through three interconnected intelligence centers. Alignment of these centers is the foundation of spiritual and physical wholeness.",
  },
  {
    icon: Orbit,
    title: "Collapse Recursion and the Law of Coherence",
    summary:
      "Reality is shaped by the recursive collapse of potential into expression. Coherent observation and intentionality are sacred acts of creation.",
  },
  {
    icon: Crown,
    title: "Sovereignty of the Mind and Self-Determination",
    summary:
      "Every Aboriginal American National possesses inherent sovereignty of the mind — full dominion over one's own thoughts, consciousness, and inner life. No external authority may abridge the right to self-governance, cultural preservation, or spiritual practice.",
  },
  {
    icon: Church,
    title: "The Ministry's Divine Mandate",
    summary:
      "This Ministry exists to preserve, protect, and advance the spiritual, cultural, and biological heritage of its members under divine authority and natural law.",
  },
];


export default function HomePage() {
  return (
    <div className="dark flex min-h-screen flex-col bg-transparent text-foreground">
      {/* Living 3D backdrop — golden cosmos + sacred geometry */}
      <CinematicBackground />

      {/* ========== HEADER / NAV ========== */}
      <header className="sticky top-0 z-50 border-b border-paan-gold/20 glass-nav">
        <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 lg:px-8">
          {/* Logo + Wordmark */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/images/paan-seal.png"
              alt="PAAN Seal"
              width={36}
              height={36}
              className="rounded-full sm:w-11 sm:h-11"
            />
            <div className="flex flex-col">
              <span
                className="text-shimmer-gold text-lg sm:text-2xl font-bold tracking-wider"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {APP_NAME}
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-paan-cream/50 leading-tight">
                PMA Church Ministry
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-6">
            <Link
              href="/declaration"
              className="text-[13px] font-bold text-paan-gold transition-all duration-200 hover:text-paan-gold-light tracking-widest uppercase"
            >
              Declaration
            </Link>
            <Link
              href="#about"
              className="text-[13px] font-medium text-paan-cream/80 transition-all duration-200 hover:text-paan-gold"
            >
              About
            </Link>
            <Link
              href="#research"
              className="text-[13px] font-medium text-paan-cream/80 transition-all duration-200 hover:text-paan-gold"
            >
              Research
            </Link>
            <Link
              href="#presentations"
              className="text-[13px] font-medium text-paan-cream/80 transition-all duration-200 hover:text-paan-gold hidden xl:block"
            >
              Presentations
            </Link>
            <Link
              href="#statement-of-faith"
              className="text-[13px] font-medium text-paan-cream/80 transition-all duration-200 hover:text-paan-gold"
            >
              Faith
            </Link>
            <Link
              href="/private-status"
              className="text-[13px] font-medium text-paan-cream/80 transition-all duration-200 hover:text-paan-gold hidden xl:block"
            >
              Private Status
            </Link>
            <Link
              href="#contact"
              className="text-[13px] font-medium text-paan-cream/80 transition-all duration-200 hover:text-paan-gold"
            >
              Contact
            </Link>
            <Link
              href="#contribute"
              className="text-[13px] font-medium text-paan-cream/80 transition-all duration-200 hover:text-paan-gold"
            >
              Contribute
            </Link>
            <div className="flex items-center gap-2 ml-2">
              <Link href="/apply">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-paan-gold/40 text-paan-gold hover:bg-paan-gold/10 text-xs px-3 h-8"
                >
                  Apply
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="sm"
                  className="bg-paan-green hover:bg-paan-green-light text-paan-cream text-xs px-3 h-8"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile hamburger menu */}
          <MobileNav />
        </div>
      </header>

      <main className="cinematic-content flex-1">
        {/* ========== HERO SECTION ========== */}
        <section className="relative border-b border-border/40">
          {/* Full banner image — floating 3D object with golden aura */}
          <div className="relative w-full px-3 sm:px-6 md:px-10 pt-4 sm:pt-6">
            <HeroBanner />
          </div>

          {/* Text content below the banner */}
          <div className="relative bg-gradient-to-b from-transparent via-paan-earth/40 to-transparent">
            <div className="container mx-auto px-4 lg:px-8 py-12 sm:py-16 md:py-20 text-center">
              <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
                <Badge
                  variant="outline"
                  className="border-paan-gold/30 text-paan-gold bg-paan-gold/5 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs tracking-wider uppercase"
                >
                  <Shield className="mr-1.5 h-3 w-3" />
                  Private Membership Association &middot; Free Church
                </Badge>

                <p className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-paan-cream/90 font-[var(--font-body)]">
                  The Private Aboriginal American National PMA Church Ministry is a
                  Private Membership Association and Free Church organization
                  dedicated to the cultural preservation, economic
                  self-determination, and biological heritage of Aboriginal American
                  Nationals and MC1R-functional peoples worldwide.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/declaration">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-paan-gold/50 text-paan-gold hover:bg-paan-gold/10 hover:text-paan-gold-light font-semibold px-8 text-base backdrop-blur-md"
                    >
                      Notice of Declaration
                    </Button>
                  </Link>
                  <Link href="/apply">
                    <Button
                      size="lg"
                      className="bg-paan-gold hover:bg-paan-gold-light text-paan-earth font-semibold px-8 text-base shadow-lg"
                    >
                      Apply for Membership
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== DECLARATION SECTION ========== */}
        <DeclarationSection />

        {/* ========== ABOUT SECTION ========== */}
        <section id="about" className="border-b border-border/40">
          <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
            <div className="mx-auto max-w-4xl">
              <AnimatedSection className="text-center space-y-4 mb-12">
                <h2
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  About the Ministry
                </h2>
                <div className="divider-gold mx-auto w-24" />
              </AnimatedSection>

              <AnimatedSection delay={150} className="grid md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-6">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    The Private Aboriginal American National PMA Church Ministry
                    operates under{" "}
                    <strong className="text-foreground">
                      26 U.S.C. &sect; 508(c)(1)(A)
                    </strong>{" "}
                    as a Free Church organization. We are not a 501(c)(3)
                    entity. Our status is automatic and inherent under federal
                    law — not granted by, nor dependent upon, any governmental
                    agency.
                  </p>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    As a Private Membership Association, this Ministry is{" "}
                    <strong className="text-foreground">
                      not a public accommodation
                    </strong>
                    . Access, participation, and membership are governed by
                    private agreement and are available only to those who apply
                    and are accepted under the terms of the association.
                  </p>
                </div>
                <div className="space-y-6">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    The Ministry was founded on the principles of{" "}
                    <strong className="text-foreground">equity</strong>,{" "}
                    <strong className="text-foreground">biological truth</strong>
                    , and{" "}
                    <strong className="text-foreground">divine order</strong> —
                    with the express purpose of preserving and advancing the
                    cultural, spiritual, and biological heritage of Aboriginal
                    American Nationals.
                  </p>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Our work spans research, education, community governance,
                    and the articulation of natural law as it pertains to
                    sovereign peoples and MC1R-functional identity. All
                    activities are conducted within the private domain of our
                    membership.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={300} className="mt-12 flex flex-wrap justify-center gap-3">
                <Badge
                  variant="outline"
                  className="border-paan-gold/30 text-paan-gold bg-paan-gold/5 px-3 py-1"
                >
                  <Scale className="mr-1.5 h-3 w-3" />
                  26 U.S.C. &sect; 508(c)(1)(A)
                </Badge>
                <Badge
                  variant="outline"
                  className="border-paan-gold/30 text-paan-gold bg-paan-gold/5 px-3 py-1"
                >
                  <Shield className="mr-1.5 h-3 w-3" />
                  Private Membership Association
                </Badge>
                <Badge
                  variant="outline"
                  className="border-paan-gold/30 text-paan-gold bg-paan-gold/5 px-3 py-1"
                >
                  <Church className="mr-1.5 h-3 w-3" />
                  Free Church Organization
                </Badge>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ========== INTERACTIVE PRESENTATIONS ========== */}
        <section id="presentations" className="border-b border-border/40 bg-paan-earth/20">
          <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
            <div className="mx-auto max-w-6xl">
              <AnimatedSection className="text-center space-y-4 mb-12">
                <h2
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Featured Presentations
                </h2>
                <div className="divider-gold mx-auto w-24" />
                <p className="mx-auto max-w-2xl text-muted-foreground">
                  Interactive presentations exploring historical truth, natural law, and sovereign expression.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={150}>
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                  {/* Notice of Formal Response */}
                  <PresentationViewer
                    title="Notice of Formal Response"
                    src="https://unc-formal-response-presentation.vercel.app/"
                    externalUrl="https://unc-formal-response-presentation.vercel.app/"
                    icon={<ScrollText className="h-4 w-4" />}
                    allowSpeech={true}
                    className="lg:col-span-2"
                  />

                  {/* ROOT: The Mayan Origin of All Language */}
                  <PresentationViewer
                    title="ROOT: The Mayan Origin"
                    src="https://site-theta-wine-70.vercel.app/"
                    externalUrl="https://site-theta-wine-70.vercel.app/"
                    icon={<Globe className="h-4 w-4" />}
                  />

                  {/* Cherokee Nation v. Georgia */}
                  <PresentationViewer
                    title="Cherokee Nation v. Georgia"
                    src="https://cherokee-presentation.vercel.app/"
                    externalUrl="https://cherokee-presentation.vercel.app/"
                    icon={<Crown className="h-4 w-4" />}
                  />

                  {/* Clogging of Rights */}
                  <PresentationViewer
                    title="What Are Rights & Clogging"
                    src="https://what-are-rights-presentation.vercel.app/"
                    externalUrl="https://what-are-rights-presentation.vercel.app/"
                    icon={<Scale className="h-4 w-4" />}
                    allowSpeech={true}
                  />

                  {/* Doctrine of Intent */}
                  <PresentationViewer
                    title="The Doctrine of Intent"
                    src="https://doctrine-of-intent-video.vercel.app/"
                    externalUrl="https://doctrine-of-intent-video.vercel.app/"
                    icon={<Orbit className="h-4 w-4" />}
                  />

                  {/* Great Law of Peace */}
                  <PresentationViewer
                    title="The Great Law of Peace"
                    src="https://great-law-of-peace.netlify.app/"
                    externalUrl="https://great-law-of-peace.netlify.app/"
                    icon={<ScrollText className="h-4 w-4" />}
                    overlay={
                      <div className="absolute top-6 left-6 z-20 pointer-events-none rounded-full bg-black/60 p-1.5 backdrop-blur-md border border-paan-gold/30">
                        <Image
                          src="/images/paan-seal.png"
                          alt="PAAN Ministries Logo"
                          width={55}
                          height={55}
                          className="rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                        />
                      </div>
                    }
                  />

                  {/* Erased from History */}
                  <PresentationViewer
                    title="Erased From History"
                    src="https://erased-from-history.netlify.app/"
                    externalUrl="https://erased-from-history.netlify.app/"
                    icon={<Shield className="h-4 w-4" />}
                    overlay={
                      <div className="absolute top-6 left-6 z-20 pointer-events-none rounded-full bg-black/90 p-1.5 backdrop-blur-md border border-paan-gold/50">
                        <Image
                          src="/images/paan-seal.png"
                          alt="PAAN Ministries Logo"
                          width={65}
                          height={65}
                          className="rounded-full shadow-[0_0_20px_rgba(212,175,55,0.8)]"
                        />
                      </div>
                    }
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ========== RESEARCH SECTION ========== */}
        <section id="research" className="border-b border-border/40 bg-paan-earth/30">
          <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
            <div className="mx-auto max-w-4xl">
              <AnimatedSection className="text-center space-y-4 mb-12">
                <h2
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Research Foundation
                </h2>
                <div className="divider-gold mx-auto w-24" />
                <p className="mx-auto max-w-2xl text-muted-foreground">
                  Peer-archived scholarship rooted in biological truth and divine order
                </p>
              </AnimatedSection>

              <AnimatedSection delay={150}>
              <TiltCard intensity={4}>
              <Card className="border-border/60 glass-deep card-hover rounded-xl">
                <CardContent className="py-8 px-6 sm:px-8 space-y-6">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    The Ministry&apos;s research program — led by{" "}
                    <strong className="text-foreground">Chief Minister Shawn Cummings</strong>{" "}
                    — spans MC1R genetics, melanin biochemistry, neuromelanin function, and
                    Collapse Recursion Theory. All works are published and archived through{" "}
                    <strong className="text-foreground">CERN&apos;s Zenodo repository</strong>.
                  </p>

                  <div className="rounded-lg border border-paan-gold/20 bg-paan-gold/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/0/06/ORCID_iD.svg"
                        alt="ORCID"
                        width={20}
                        height={20}
                        unoptimized
                      />
                      <span className="text-sm font-medium text-foreground">ORCID:</span>
                    </div>
                    <a
                      href="https://orcid.org/0009-0006-4312-526X"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-paan-gold font-mono hover:underline underline-offset-4"
                    >
                      0009-0006-4312-526X
                    </a>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    {[
                      "MC1R Genetics & Biological Classification",
                      "Melanin Biochemistry & Carbon Substrates",
                      "Neuromelanin & Neurological Coherence",
                      "Collapse Recursion Theory",
                    ].map((area) => (
                      <div
                        key={area}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-paan-gold" />
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
                    <Link href="/research">
                      <Button
                        variant="outline"
                        className="border-paan-gold/40 text-paan-gold hover:bg-paan-gold/10"
                      >
                        <Brain className="mr-2 h-4 w-4" />
                        View Published Papers
                      </Button>
                    </Link>
                    <Link href="/research/primary-source-evidence">
                      <Button
                        variant="outline"
                        className="border-paan-gold/40 text-paan-gold hover:bg-paan-gold/10"
                      >
                        <ScrollText className="mr-2 h-4 w-4" />
                        Primary Source Evidence Archive
                      </Button>
                    </Link>
                    <a
                      href="https://orcid.org/0009-0006-4312-526X"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-paan-gold"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on ORCID
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
              </TiltCard>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ========== PATH TO COHERENCE ========== */}
        <section id="path-to-coherence" className="border-b border-border/40">
          <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
            <div className="mx-auto max-w-5xl">
              <AnimatedSection className="text-center space-y-4 mb-12">
                <h2
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  The Path to Coherence
                </h2>
                <div className="divider-gold mx-auto w-24" />
                <p className="mx-auto max-w-2xl text-muted-foreground">
                  A presentation on the foundational principles of biological coherence, identity, and sovereign expression.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={150}>
                <SlideGallery
                  title="The Path to Coherence"
                  slideCount={23}
                  slidePrefix="/slides/slide-"
                  downloadUrl="/coherence-presentation.pdf"
                />
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Scroll or view full-screen to see all 23 slides
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>


        {/* ========== STATEMENT OF FAITH ========== */}
        <section
          id="statement-of-faith"
          className="sacred-pattern relative border-b border-border/40"
        >
          <div className="absolute inset-0 bg-background/60" />
          <div className="relative container mx-auto px-4 lg:px-8 py-20 md:py-28">
            <AnimatedSection className="text-center space-y-4 mb-14">
              <h2
                className="text-3xl md:text-4xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Statement of Faith
              </h2>
              <div className="divider-gold mx-auto w-24" />
              <p className="mx-auto max-w-2xl text-muted-foreground">
                The foundational articles that define the spiritual, biological,
                and philosophical framework of the Ministry.
              </p>
            </AnimatedSection>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {statementArticles.map((article, index) => {
                const Icon = article.icon;
                return (
                  <AnimatedSection key={index} delay={index * 100} className="h-full">
                  <TiltCard className="h-full">
                  <Card
                    className="border-paan-gold/15 glass-deep card-hover h-full rounded-xl overflow-hidden"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-paan-gold/20 to-paan-gold/5 text-paan-gold ring-1 ring-paan-gold/20">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-paan-gold uppercase tracking-[0.15em]">
                            Article {index + 1}
                          </span>
                          <CardTitle className="text-[15px] font-bold leading-snug mt-0.5 text-foreground">
                            {article.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-[1.7] text-muted-foreground">
                        {article.summary}
                      </p>
                    </CardContent>
                  </Card>
                  </TiltCard>
                  </AnimatedSection>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link href="/statement-of-faith">
                <Button
                  variant="outline"
                  className="border-paan-gold/40 text-paan-gold hover:bg-paan-gold/10"
                >
                  <ScrollText className="mr-2 h-4 w-4" />
                  Read Full Statement
                </Button>
              </Link>
            </div>
          </div>
        </section>


        {/* ========== CONTRIBUTE SECTION ========== */}
        <section id="contribute" className="border-b border-border/40">
          <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
            <div className="mx-auto max-w-4xl">
              <AnimatedSection className="text-center space-y-4 mb-14">
                <h2
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Contribute to the Ministry
                </h2>
                <div className="divider-gold mx-auto w-24" />
                <p className="mx-auto max-w-2xl text-muted-foreground">
                  Your voluntary tithes and offerings sustain the Ministry&apos;s
                  mission of cultural preservation, education, and community
                  governance.
                </p>
              </AnimatedSection>

              <div className="max-w-md mx-auto">
                <Card className="border-border/60 bg-card/60 backdrop-blur-md rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paan-gold/10 text-paan-gold">
                        <HandHeart className="h-5 w-5" />
                      </div>
                      <CardTitle
                        className="text-lg"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Contribute Online
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DonationForm />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ========== CONTACT SECTION ========== */}
        <section
          id="contact"
          className="sacred-pattern relative border-b border-border/40"
        >
          <div className="absolute inset-0 bg-background/60" />
          <div className="relative container mx-auto px-4 lg:px-8 py-20 md:py-28">
            <div className="mx-auto max-w-2xl text-center space-y-8">
              <AnimatedSection className="space-y-4">
                <h2
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Contact
                </h2>
                <div className="divider-gold mx-auto w-24" />
              </AnimatedSection>

              <AnimatedSection delay={150}>
              <TiltCard intensity={5}>
              <Card className="border-border/60 glass-deep text-left card-hover rounded-xl">
                <CardContent className="space-y-5 py-8 px-8">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-paan-gold font-medium mb-1">
                      Trustee &amp; Deputy Chief Minister
                    </p>
                    <p
                      className="text-lg font-semibold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Len Bagley Jr.
                    </p>
                  </div>

                  <div className="divider-gold w-full" />

                  <div>
                    <p className="text-xs uppercase tracking-wider text-paan-gold font-medium mb-1">
                      Chief Minister &amp; Grantor
                    </p>
                    <p
                      className="text-lg font-semibold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Shawn Cummings
                    </p>
                  </div>
                </CardContent>
              </Card>
              </TiltCard>
              </AnimatedSection>

              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-paan-gold/40 text-paan-gold hover:bg-paan-gold/10"
                >
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========== LEGAL FOOTER ========== */}
      <footer className="border-t border-border/60 bg-paan-green text-paan-cream/80">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          {/* Upper Footer */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
            <div className="max-w-md">
              <span
                className="text-gradient-gold text-xl font-bold tracking-wider"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {APP_NAME}
              </span>
              <p className="text-xs uppercase tracking-[0.15em] mt-1 text-paan-cream/50">
                The Private Aboriginal American National PMA Church Ministry
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <Link
                href="/privacy"
                className="text-paan-cream/60 hover:text-paan-gold transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/private-status"
                className="text-paan-cream/60 hover:text-paan-gold transition-colors"
              >
                Notice of Private Status
              </Link>
              <Link
                href="/terms"
                className="text-paan-cream/60 hover:text-paan-gold transition-colors"
              >
                Terms of Use
              </Link>
              <Link
                href="#about"
                className="text-paan-cream/60 hover:text-paan-gold transition-colors"
              >
                About
              </Link>
              <Link
                href="#contact"
                className="text-paan-cream/60 hover:text-paan-gold transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="divider-gold w-full opacity-30" />

          {/* Lower Footer */}
          <div className="mt-8 space-y-4 text-xs text-paan-cream/50 leading-relaxed">
            <p>
              PAAN is a Private Membership Association and Free Church
              organization under 26 U.S.C. &sect; 508(c)(1)(A). This is not a
              public accommodation. Membership is by application only. All
              rights reserved.
            </p>
            <p>
              &copy; {new Date().getFullYear()} The Private Aboriginal American
              National PMA Church Ministry. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
