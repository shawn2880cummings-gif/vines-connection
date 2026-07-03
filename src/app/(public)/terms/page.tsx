import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Terms of Use | ${APP_NAME}`,
  description:
    "Terms of Use for The Private Aboriginal American National PMA Church Ministry.",
};

export default function TermsPage() {
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
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Terms of Use
            </h1>
            <p className="text-sm text-muted-foreground">
              Last Updated: February 23, 2026
            </p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-medium">
              NOTICE: The Private Aboriginal American National PMA Church
              Ministry (&quot;PAAN&quot;) is a Private Membership Association
              operating as a Free Church under 26 U.S.C. &sect; 508(c)(1)(A).
              PAAN is not a 501(c)(3) organization and is not a public
              accommodation. These Terms of Use are a private agreement between
              the Ministry and its members and applicants. They do not constitute
              a public contract of adhesion.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              1. Private Membership Association
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              PAAN is a Private Membership Association (&quot;PMA&quot;). It is
              not a public accommodation, a commercial business, or a government
              entity. Access to the Ministry, its website, services, resources,
              and fellowship is restricted to members and approved applicants.
              The general public does not have a right of access to the
              Ministry&apos;s private domain.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              2. Access by Invitation and Application Only
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Membership in PAAN is available only by invitation or through the
              Ministry&apos;s formal application process. The Ministry reserves
              the absolute right to accept or deny any application for
              membership at its sole discretion, consistent with the
              Ministry&apos;s Charter and Bylaws. No individual has an inherent
              right to membership.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              3. Voluntary Association and Constitutional Protections
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All members of PAAN have voluntarily chosen to associate with one
              another for mutual benefit, spiritual growth, education, and
              fellowship. This voluntary association is protected under the First
              Amendment to the United States Constitution (freedom of religion,
              freedom of association, and freedom of assembly) and the Fourteenth
              Amendment (right to privacy and due process).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By joining or applying to PAAN, you affirm that your participation
              is entirely voluntary and that you freely choose to enter into this
              private association.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              4. Equity Law Jurisdiction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The Ministry operates under equity law, not statutory regulation.
              As a Private Membership Association and Free Church, PAAN conducts
              its internal affairs according to its Charter, Bylaws, and
              ecclesiastical authority. The Ministry does not consent to the
              jurisdiction of federal or state regulatory agencies over its
              internal membership affairs.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              5. Membership Suspension and Termination
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Membership may be suspended or terminated at any time per the
              Ministry&apos;s Charter and Bylaws. Grounds for suspension or
              termination include but are not limited to: violation of the
              Ministry&apos;s code of conduct, breach of the PMA agreement,
              failure to maintain membership requirements, or conduct
              detrimental to the Ministry&apos;s mission and fellowship.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The Ministry&apos;s leadership holds sole discretion in all matters
              of membership status.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              6. Internal Dispute Resolution
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All disputes arising between members, or between a member and the
              Ministry, shall be resolved internally in accordance with the
              Ministry&apos;s Bylaws and ecclesiastical governance procedures.
              Members acknowledge the Sixth Amendment protections applicable to
              the Ministry&apos;s internal proceedings. Members agree that the
              Ministry&apos;s internal dispute resolution process is the
              exclusive forum for resolving any and all disputes related to
              membership, contributions, participation, or any other matter
              arising from association with PAAN.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              7. Hold Harmless Agreement
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By becoming a member of or applying to PAAN, you agree to hold
              harmless the Ministry, its trustees, officers, ministers, agents,
              and fellow members from any and all claims, liabilities, damages,
              costs, or expenses (including legal fees) arising from your
              participation in the Ministry&apos;s activities, use of the
              Ministry&apos;s resources, or any matter related to your
              membership or application.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              8. MC1R-Functional Biological Verification
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              As part of the membership process, applicants may be required to
              submit MC1R-functional biological verification. This requirement
              exists in accordance with the Ministry&apos;s Charter and
              ecclesiastical mission. Verification data is classified under the
              highest tier of the Ministry&apos;s data protection framework
              (Sacred/Genetic) and is handled exclusively by designated
              ecclesiastical officers. See our{" "}
              <Link
                href="/privacy"
                className="text-primary underline hover:no-underline"
              >
                Privacy Policy
              </Link>{" "}
              for details on data handling.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              9. Membership Contributions
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Financial contributions made to PAAN are membership contributions
              made pursuant to the Ministry&apos;s Charter. They are not
              charitable donations, tax-deductible contributions, or payments for
              goods or services. PAAN is not a 501(c)(3) organization and does
              not solicit charitable donations from the public.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Application fees, admission fees, and recurring membership
              contributions are governed by the terms set forth in the
              Ministry&apos;s Charter and Bylaws. Refund policies, if any, are
              determined by the Ministry&apos;s leadership.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              10. Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All content, materials, courses, documents, and resources provided
              through the Ministry&apos;s systems are the property of PAAN and
              are made available exclusively for the benefit of members in good
              standing. Reproduction, distribution, or disclosure of the
              Ministry&apos;s proprietary materials to non-members is strictly
              prohibited.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              11. Confidentiality
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All activities, communications, records, and proceedings within
              PAAN are private and confidential. Members shall not disclose
              private association matters, membership rosters, internal
              communications, or any other confidential Ministry information to
              non-members or external parties without the express written consent
              of the Ministry&apos;s leadership.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              12. Amendments
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              PAAN reserves the right to amend these Terms of Use at any time in
              accordance with the Ministry&apos;s Charter and Bylaws. Members
              will be notified of material changes through the Ministry&apos;s
              internal communication channels. Continued membership and use of
              the Ministry&apos;s systems following notification of changes
              constitutes acceptance of the amended terms.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              13. Governing Authority
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Use are governed by the Ministry&apos;s Charter,
              Bylaws, and ecclesiastical authority. The Ministry operates under
              the protections afforded to Private Membership Associations and
              Free Churches under the Constitution of the United States and 26
              U.S.C. &sect; 508(c)(1)(A).
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions regarding these Terms of Use, please contact:
            </p>
            <div className="rounded-md border p-4">
              <p className="font-medium">Deputy Chief Minister Len Bagley Jr.</p>
              <p className="text-sm text-muted-foreground">
                The Private Aboriginal American National PMA Church Ministry
              </p>
            </div>
          </section>
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
          <Link href="/terms" className="hover:text-foreground">
            Terms of Use
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
