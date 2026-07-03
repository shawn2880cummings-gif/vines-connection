import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Notice of Private Status | ${APP_NAME}`,
  description:
    "Notice of Private Status of The Private Aboriginal American National PMA Church Ministry.",
};

export default function PrivateStatusPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            {APP_NAME}
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <article className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Notice of Private Status
            </h1>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              To All Persons, Agencies, and Entities
            </p>
          </div>

          <div className="divider-gold mx-auto w-24" />

          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm leading-relaxed">
              <strong>YOU ARE HEREBY NOTIFIED</strong> that The Private Aboriginal
              American National PMA Church Ministry, publicly known as PAAN, is a{" "}
              <strong>Private Membership Association</strong> operating as a Free
              Church organization. This Notice sets forth the legal status,
              jurisdictional boundaries, and rights of the Ministry and is provided
              to all prospective Members, external parties, and any agency or entity
              that may encounter the Ministry or its instruments.
            </p>
          </div>

          {/* Section I */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              I. The Ministry Is Not a Public Accommodation
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                1. The Ministry is a <strong className="text-foreground">private association</strong> of
                individuals who have voluntarily entered into private contract with
                one another and with the Ministry. The Ministry is{" "}
                <strong className="text-foreground">not</strong> a public accommodation, a commercial
                enterprise, a statutory entity, a 501(c)(3) organization, or a
                corporation.
              </p>
              <p>
                2. The Ministry does not offer goods or services to the general
                public. All activities, programs, resources, and communications of
                the Ministry are{" "}
                <strong className="text-foreground">exclusively for Members</strong> who have executed
                the Private Membership Agreement and been accepted by the Board of
                Trustees.
              </p>
              <p>
                3. No person has a &quot;right&quot; to become a Member of the
                Ministry. Membership is a{" "}
                <strong className="text-foreground">private privilege</strong> extended at the sole
                discretion of the Ministry. The Ministry reserves the absolute right
                to accept or reject any application for membership without
                explanation.
              </p>
            </div>
          </section>

          {/* Section II */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              II. Jurisdictional Declaration
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                1. The Ministry operates within the exclusive jurisdiction of:
              </p>
              <ul className="list-none pl-6 space-y-2">
                <li>
                  (a) The <strong className="text-foreground">First Amendment</strong> to the United
                  States Constitution (Free Exercise and Establishment Clauses);
                </li>
                <li>
                  (b) The <strong className="text-foreground">Church Audit Procedures Act</strong> (26
                  U.S.C. &sect; 7611);
                </li>
                <li>
                  (c) <strong className="text-foreground">Equity jurisdiction</strong> and the inherent
                  right of private contract; and
                </li>
                <li>
                  (d) <strong className="text-foreground">Treaty law</strong>, including the
                  Moroccan-American Treaty of Friendship (1786/1836), the oldest
                  unbroken treaty relationship of the United States.
                </li>
              </ul>
              <p>
                2.{" "}
                <strong className="text-foreground">
                  No federal, state, or local government agency, regulatory body,
                  law enforcement entity, or court has jurisdiction
                </strong>{" "}
                over the Ministry&apos;s internal ecclesiastical affairs, doctrine,
                membership decisions, governance, or private records, except as
                specifically provided under 26 U.S.C. &sect; 7611.
              </p>
              <p>
                3. Any attempt to exercise unauthorized jurisdiction over the
                Ministry or its Members shall be regarded as a{" "}
                <strong className="text-foreground">
                  trespass upon private ecclesiastical property
                </strong>{" "}
                and shall be met with all lawful remedies available to the Ministry
                under equity, treaty law, and constitutional protections.
              </p>
            </div>
          </section>

          {/* Section III */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              III. Status Under 26 U.S.C. &sect; 508(c)(1)(A)
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                1. The Ministry is a{" "}
                <strong className="text-foreground">mandatory exception church</strong> under 26 U.S.C.
                &sect; 508(c)(1)(A). This status is not applied for, granted, or
                licensed by any government agency. It exists by operation of law.
                Churches and their integrated auxiliaries are{" "}
                <strong className="text-foreground">automatically exempt</strong> from the requirement
                to apply for recognition of tax-exempt status under &sect;
                501(c)(3).
              </p>
              <p>
                2. The Ministry has not applied for, does not hold, and does not
                seek a 501(c)(3) determination letter from the Internal Revenue
                Service. The Ministry&apos;s status exists{" "}
                <strong className="text-foreground">
                  independently of any government recognition or approval
                </strong>
                .
              </p>
            </div>
          </section>

          {/* Section IV */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              IV. Notice to Prospective Members
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Any individual seeking membership in the Ministry should understand
                the following <strong className="text-foreground">before</strong> executing the Private
                Membership Agreement:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  By joining the Ministry, you are entering a{" "}
                  <strong className="text-foreground">private contract</strong>. Your rights and
                  obligations are governed by the Ministry&apos;s Charter, Bylaws,
                  Statement of Faith, Membership Agreement, and other governing
                  instruments &mdash;{" "}
                  <strong className="text-foreground">
                    not by statutory consumer protection law
                  </strong>
                  .
                </li>
                <li>
                  All disputes between Members and the Ministry are resolved{" "}
                  <strong className="text-foreground">
                    exclusively within the Ministry&apos;s internal ecclesiastical
                    jurisdiction
                  </strong>
                  . By signing the Membership Agreement, you voluntarily agree to
                  resolve all disputes internally and waive the right to bring
                  actions in external courts or before external agencies.
                </li>
                <li>
                  Your personal data, biological verification data, and financial
                  information are held in sacred trust by the Ministry and are{" "}
                  <strong className="text-foreground">never disclosed to external parties</strong>{" "}
                  except as provided in the Ministry&apos;s Privacy Policy.
                </li>
                <li>
                  Membership may be terminated by the Ministry for cause in
                  accordance with the governing instruments. The Ministry is not
                  required to provide a reason for rejection of any membership
                  application.
                </li>
              </ol>
            </div>
          </section>

          {/* Section V */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              V. Notice to External Parties
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Any government agency, regulatory body, financial institution,
                corporation, or individual that receives this Notice or encounters
                the Ministry or its instruments is hereby informed:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  The Ministry&apos;s records, member lists, financial data,
                  biological data, and internal communications are{" "}
                  <strong className="text-foreground">
                    private ecclesiastical records
                  </strong>{" "}
                  protected by the First Amendment and 26 U.S.C. &sect; 7611.
                </li>
                <li>
                  Any request for information from or about the Ministry must comply
                  with the{" "}
                  <strong className="text-foreground">Church Audit Procedures Act</strong> (26 U.S.C.
                  &sect; 7611), including the requirements for a{" "}
                  <strong className="text-foreground">church tax inquiry</strong> and{" "}
                  <strong className="text-foreground">church tax examination</strong> as defined
                  therein.
                </li>
                <li>
                  Unsolicited demands for information, subpoenas that do not comply
                  with &sect; 7611, and any other attempt to compel disclosure of
                  private Ministry records shall be{" "}
                  <strong className="text-foreground">refused and returned</strong> with a copy of this
                  Notice and a formal objection.
                </li>
              </ol>
            </div>
          </section>

          <div className="divider-gold mx-auto w-24" />

          <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
            This Notice is effective upon publication and remains in force
            indefinitely.
          </p>
        </article>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <p className="mt-1">
          Private Membership Association &mdash; Members Only
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms of Use
          </Link>
        </div>
      </footer>
    </div>
  );
}
