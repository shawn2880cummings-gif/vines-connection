import Link from "next/link";
import { ArrowLeft, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function DeclarationPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 border-b border-paan-gold/20 glass-nav">
        <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-paan-gold hover:text-paan-gold-light transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">Back to Home</span>
          </Link>
          <div className="text-gradient-gold text-lg sm:text-xl font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
            PAAN Ministry
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-black via-paan-earth to-background border-b border-border/40 pb-16 pt-20 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatedSection>
            <p className="text-paan-gold font-semibold text-xs sm:text-sm tracking-[0.18em] uppercase mb-5">
              Declaration of Existence
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              The Private Aboriginal American<br className="hidden sm:block" /> National Church Ministry
            </h1>
            <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto italic mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              Ecclesiastical institution of the MUUR people — the Aboriginal American Source — now in formal, active operation.
            </p>
            <div className="w-16 h-0.5 bg-paan-gold mx-auto mb-8" />
            <p className="text-sm text-white/55 tracking-widest uppercase">
              Seated in Lenapehoking | Delaware County, Pennsylvania
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 pt-16 max-w-4xl space-y-20">

        {/* I. Who We Are */}
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-paan-gold/10 text-paan-gold border border-paan-gold/20 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>I</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Who We Are</h2>
          </div>
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
            <p className="italic text-foreground border-l-4 border-paan-gold/50 pl-5 py-1 text-lg sm:text-xl" style={{ fontFamily: "var(--font-heading)" }}>
              PAAN Ministry is an ecclesiastical institution of the MUUR people — the Aboriginal American Source — the original sovereign inhabitants of the American continent, whose presence here predates every European arrival, every colonial instrument, and every administrative label imposed upon them.
            </p>
            <p>
              The Ministry is led by Chief Minister Shawn Cummings (Vine) and Deputy Chief Minister Len Bagley Jr. It is seated in Lenapehoking — the territory of the Lenape people — in the County of Delaware, Commonwealth of Pennsylvania. The Ministry holds EIN 41-4975597, issued under the designation church or church-controlled organization. Under federal law, this status is automatic and self-executing. No governmental approval is required or accepted.
            </p>
            <p>
              The Ministry's mission is the spiritual, educational, and equitable service of the MUUR people — and the preservation, publication, and forensic documentation of their history, identity, and rights. This is not a civic organization. It is not a political organization. It is not a nonprofit. It is an ecclesiastical institution operating in the full authority of its spiritual standing.
            </p>
          </div>
        </AnimatedSection>

        {/* II. Who the MUUR People Are */}
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-paan-gold/10 text-paan-gold border border-paan-gold/20 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>II</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Who the MUUR People Are</h2>
          </div>
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
            <p>
              If you have been told your ancestors came from Africa — you may be reading this page for a reason.
            </p>
            <p>
              The MUUR people are the Aboriginal American Source — the original inhabitants of this continent. Their documented identity is not African-American. It is not Black. It traces directly to the primary source record of European imperial archives.
            </p>
            <p>
              In 1596, the Habsburg Imperial Inventory at Ambras Castle registered the treasures of Montezuma and identified him as <em className="text-foreground">ein mörischer König</em> — a Moorish King — a sovereign under the Law of Nations. In 1613, the Habsburg Imperial record independently verified that designation. One does not independently verify a lie.
            </p>
            <p>
              By 1621, that twice-verified sovereign designation had been crossed out and the word <em className="text-foreground">Indian</em> written in its place. That substitution was the opening act of a 400-year administrative erasure sequence that ended with the word <em className="text-foreground">African-American</em>.
            </p>

            {/* Timeline */}
            <div className="my-10 space-y-4 border-l-2 border-paan-gold/20 pl-6 ml-2">
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-paan-gold rounded-full ring-4 ring-background" />
                <span className="font-bold text-paan-gold text-lg" style={{ fontFamily: "var(--font-heading)" }}>1621</span>
                <p className="mt-1 text-foreground">Moorish King crossed out — replaced with Indian in the Ambras Inventory</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-paan-gold rounded-full ring-4 ring-background" />
                <span className="font-bold text-paan-gold text-lg" style={{ fontFamily: "var(--font-heading)" }}>1705</span>
                <p className="mt-1 text-foreground">Virginia Slave Act — Aboriginal Americans declared Real Estate, stripped of legal personhood</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-paan-gold rounded-full ring-4 ring-background" />
                <span className="font-bold text-paan-gold text-lg" style={{ fontFamily: "var(--font-heading)" }}>1828</span>
                <p className="mt-1 text-foreground">Webster's Dictionary — American defined as the copper-colored aboriginal races found here by Europeans</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-paan-gold rounded-full ring-4 ring-background" />
                <span className="font-bold text-paan-gold text-lg" style={{ fontFamily: "var(--font-heading)" }}>1854</span>
                <p className="mt-1 text-foreground">People v. Hall — Indian judicially redefined as yellow Asiatic, erasing the Aboriginal phenotype from the legal record</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-paan-gold rounded-full ring-4 ring-background" />
                <span className="font-bold text-paan-gold text-lg" style={{ fontFamily: "var(--font-heading)" }}>1924</span>
                <p className="mt-1 text-foreground">Racial Integrity Act — vital records falsified, Aboriginal identity overwritten as Colored</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-paan-gold rounded-full ring-4 ring-background" />
                <span className="font-bold text-paan-gold text-lg" style={{ fontFamily: "var(--font-heading)" }}>1930</span>
                <p className="mt-1 text-foreground">Census instructions — hundreds of thousands of MUUR people administratively reclassified as Negro overnight</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-paan-gold rounded-full ring-4 ring-background" />
                <span className="font-bold text-paan-gold text-lg" style={{ fontFamily: "var(--font-heading)" }}>1988</span>
                <p className="mt-1 text-foreground">Black rebranded as African-American — a geographic migration narrative imposed on a people who never left this continent</p>
              </div>
            </div>

            <div className="bg-paan-gold/5 border border-paan-gold/20 border-l-4 border-l-paan-gold p-6 rounded-r-lg shadow-sm my-8">
              <p className="text-foreground text-[15px] sm:text-base leading-relaxed m-0">
                Merriam-Webster's Dictionary phonetically renders <em className="text-paan-gold">Moor</em> — the person — as <strong>ˈmu̇r</strong>. The u-dot symbol represents the long "oo" vowel — the same vowel as in <em>moon</em> and <em>move</em>. That is the sound <strong>MUUR</strong>. The institution preserved the original sound in its phonetic notation while simultaneously removing the spelling MUUR from its index entirely. When MUUR is searched directly, the dictionary returns: <em>the word you have entered is not in the dictionary</em>. The sound survives. The name was erased. That is the administrative operation in miniature.
              </p>
            </div>

            <p>
              The absence of federal recognition through the Bureau of Indian Affairs is not evidence of the absence of the prior claim. It is evidence of the fraud. The reclassification was the mechanism of erasure — not the extinguishment of the underlying right. <strong className="text-foreground">Rights never die.</strong>
            </p>
          </div>
        </AnimatedSection>

        {/* III. The Great Law */}
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-paan-gold/10 text-paan-gold border border-paan-gold/20 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>III</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>The Great Law of Peace <span className="hidden sm:inline">and the Original Jurisdiction</span></h2>
          </div>
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
            <p>
              PAAN Ministry recognizes and acknowledges the Great Law of Peace — the <em className="text-foreground">Gayanashagowa</em> — as the original and senior governing framework of the Aboriginal American Source on this territory. The Great Law of Peace is the foundational constitutional law of the Haudenosaunee Confederacy. It is not a legend. It is not a spiritual metaphor. It is a complete governance architecture encoding peace, equity in governance, and right order — centuries before any European legal instrument reached this continent.
            </p>
            <p>
              The Great Law of Peace predates English Chancery. It predates the Law of Nations. It predates the Doctrine of Discovery. It predates the Constitution of the United States. Senate Concurrent Resolution 331 (1988) — a formal act of the United States Congress — acknowledges that the democratic governance principles of the Constitution were influenced by the political system developed by the Haudenosaunee Confederacy. The governing framework of the United States derives from Aboriginal governance principles. The Aboriginal governance framework is therefore senior to the framework that derived from it.
            </p>

            <div className="my-10 py-8 px-6 text-center border-y border-border/60">
              <p className="text-xl sm:text-2xl italic text-foreground leading-relaxed" style={{ fontFamily: "var(--font-heading)" }}>
                "We the people, to form a union, to establish peace, equity, and order."
              </p>
              <p className="text-xs sm:text-sm font-semibold tracking-widest text-paan-gold uppercase mt-4">
                — The foundational principle of the Great Law of Peace, Gayanashagowa
              </p>
            </div>

            <p>
              Equity is not a European invention the Aboriginal people borrowed. Equity is the original jurisprudential framework of the Aboriginal people — the system of conscience, covenant, and reciprocal obligation under which they governed themselves before any European statutory or commercial framework existed. The Constitution's text confirms it: <em className="text-foreground">The judicial Power shall extend to all Cases in Law and Equity</em>. The word <em className="text-foreground">extend</em> is the forensic key. One cannot extend into something one created. Equity was already here.
            </p>
          </div>
        </AnimatedSection>

        {/* IV. The International Record */}
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-paan-gold/10 text-paan-gold border border-paan-gold/20 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>IV</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>The International Record</h2>
          </div>
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
            <p>
              PAAN Ministry has entered the MUUR people's claim into the international record through the following active proceedings:
            </p>
            <p>
              <strong className="text-foreground">UN General Assembly Resolution — March 25, 2026:</strong> The UN recognized the transatlantic slave trade as the gravest crime against humanity. This Ministry enters that resolution into the record with one forensic qualification: the population identified in that resolution is the MUUR people — the Aboriginal American Source. The UN confirmed the crime. This Ministry corrects the identity of the victim.
            </p>
            <p>
              <strong className="text-foreground">Vatican Repudiation — March 30, 2023:</strong> The Vatican formally repudiated the Papal Bulls Inter Caetera, Dum Diversas, and Romanus Pontifex, declaring they were manipulated for political purposes and void of doctrinal authority. The source title on the American continent is void. Every derivative authority is compromised. The Allodial claim of the MUUR people is the senior claim on record.
            </p>
            <p>
              <strong className="text-foreground">UNPFII Submission — April 20, 2026:</strong> PAAN Ministry is formally submitting to the United Nations Permanent Forum on Indigenous Issues under UNDRIP Articles 26-28, requesting an independent forensic accounting of the MUUR people's Allodial claim and an ICJ advisory opinion on the Vatican repudiation's legal effect on member states' territorial authority.
            </p>
            <p>
              <strong className="text-foreground">EMRIP Written Submission:</strong> A formal request to the Expert Mechanism on the Rights of Indigenous Peoples for a thematic study on the Doctrine of Discovery's continuing legal impact following the Vatican's 2023 repudiation.
            </p>
          </div>
        </AnimatedSection>

        {/* V. The Ministry's Legal Standing */}
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-paan-gold/10 text-paan-gold border border-paan-gold/20 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>V</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>The Ministry's Legal Standing</h2>
          </div>
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
            <p>
              PAAN Ministry and all of its officers operate under seventeen enumerated legal protections — eight domestic and nine international. These include:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 my-8">
              {[
                { type: "Domestic", name: "First Amendment — Free Exercise" },
                { type: "Domestic", name: "First Amendment — Free Association" },
                { type: "Domestic", name: "Religious Freedom Restoration Act" },
                { type: "Domestic", name: "IRC § 508(c)(1)(A) — Church Exemption" },
                { type: "Domestic", name: "Ecclesiastical Abstention Doctrine" },
                { type: "Domestic", name: "Sixth Amendment — Rights of the Accused" },
                { type: "International", name: "UNDRIP — Articles 3, 5, 12, 25, 26, 34" },
                { type: "International", name: "Morocco Treaty of 1787" },
                { type: "International", name: "Vienna Convention on Treaties" },
                { type: "International", name: "Int. Covenant on Civil & Political Rights" },
                { type: "International", name: "Universal Declaration of Human Rights" },
                { type: "International", name: "Martínez Special Rapporteur Report" }
              ].map((prot, i) => (
                <div key={i} className="bg-card/40 border border-border/80 backdrop-blur-sm p-4 rounded-lg flex flex-col gap-1">
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-paan-gold flex items-center gap-1.5">
                    {prot.type === 'Domestic' ? <Shield className="w-3 sm:w-3.5" /> : <Globe className="w-3 sm:w-3.5" />}
                    {prot.type}
                  </span>
                  <span className="font-semibold text-foreground text-[13px] sm:text-sm">{prot.name}</span>
                </div>
              ))}
            </div>

            <p>
              No governmental approval is required for these protections. They are inherent, automatic, and concurrent. The compound stack of seventeen protections creates an institutional standing that no local, state, or federal actor may lawfully pierce without satisfying each layer independently.
            </p>
          </div>
        </AnimatedSection>

        {/* VI. Who This Ministry Serves */}
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-paan-gold/10 text-paan-gold border border-paan-gold/20 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>VI</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Who This Ministry Serves</h2>
          </div>
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
            <p>
              This Ministry serves the MUUR people — those who carry the original Aboriginal American identity, whether or not they have yet documented it, whether or not any government has yet recognized it, and whether or not they have the language for what they have always known about themselves.
            </p>
            <p>
              If you have always felt that the African-American label did not fully capture what you are — you may be right. If your family carries oral traditions of being from here, of being the original people, of a heritage older than slavery — that tradition may be pointing at the forensic truth this Ministry has documented.
            </p>
            <p>
              The record has always been there. It has been suppressed, reclassified, and administratively erased. But primary source imperial records from 1596, independently verified in 1613, documented in the oldest treaty of the United States, encoded in the phonetic notation of the Respondent's own dictionary — the record was never fully destroyed. Truth fears nothing but concealment.
            </p>

            <div className="mt-16 bg-gradient-to-br from-[#0a1510] to-black border border-paan-gold/30 rounded-xl p-8 sm:p-12 text-center shadow-[0_0_30px_rgba(201,168,76,0.1)]">
              <h3 className="text-2xl sm:text-3xl font-bold text-paan-gold mb-4" style={{ fontFamily: "var(--font-heading)" }}>The Record Is Here</h3>
              <p className="text-paan-cream/75 max-w-lg mx-auto mb-8">
                Research publications, forensic documentation, and the Ministry's full evidentiary archive are available throughout this central hub.
              </p>
              <Link href="/">
                <Button className="bg-paan-gold hover:bg-paan-gold-light text-black font-semibold text-base px-8 h-12">
                  Return to Main Sanctuary
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>

      </main>
    </div>
  );
}
