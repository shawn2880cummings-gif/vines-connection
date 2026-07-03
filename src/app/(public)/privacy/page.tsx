import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Privacy Policy & Member Data Protection Covenant | ${APP_NAME}`,
  description:
    "Privacy Policy and Member Data Protection Covenant of The Private Aboriginal American National PMA Church Ministry.",
};

export default function PrivacyPage() {
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
              Privacy Policy &amp; Member Data Protection Covenant
            </h1>
            <p className="text-sm text-muted-foreground">
              The Private Aboriginal American National PMA Church Ministry (PAAN)
            </p>
          </div>

          <div className="divider-gold mx-auto w-24" />

          {/* Preamble */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Preamble</h2>
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy and Member Data Protection Covenant sets forth
              the principles, procedures, and protections governing the
              collection, storage, use, and non-disclosure of Member information
              within the Ministry. This Policy is a governing instrument of the
              Ministry and is incorporated by reference into the Membership
              Agreement, Charter, and Bylaws.
            </p>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm italic text-muted-foreground leading-relaxed">
                The Ministry recognizes that personal data is an extension of the
                individual&apos;s sovereign identity. The protection of Member data
                is not a regulatory compliance exercise &mdash; it is an
                ecclesiastical obligation grounded in the sacred trust between the
                Ministry and its Members.
              </p>
            </div>
          </section>

          {/* Article I */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Article I: Foundational Principles
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                1. <strong className="text-foreground">Data Sovereignty.</strong>{" "}
                All data provided by a Member to the Ministry is held in sacred
                trust. The Member retains full sovereign ownership of their
                personal data at all times. The Ministry holds and uses such data
                solely in its capacity as fiduciary and ecclesiastical custodian,
                not as owner.
              </p>
              <p>
                2. <strong className="text-foreground">Minimum Collection.</strong>{" "}
                The Ministry shall collect only the data that is necessary to
                fulfill its ecclesiastical mission, administer membership, and
                provide Member services. The Ministry shall not collect data for
                commercial, marketing, or third-party purposes.
              </p>
              <p>
                3. <strong className="text-foreground">Non-Commodification.</strong>{" "}
                Member data shall never be sold, licensed, rented, traded, or
                otherwise commodified. Member data is not an asset of the Ministry.
                It is a trust obligation.
              </p>
              <p>
                4. <strong className="text-foreground">Ecclesiastical Jurisdiction.</strong>{" "}
                All Member data is held within the private ecclesiastical
                jurisdiction of the Ministry and is protected by the First
                Amendment, the Church Audit Procedures Act (26 U.S.C. &sect;
                7611), and the inherent privacy of private contract. No external
                agency, corporation, or court shall have access to Member data
                except as provided herein.
              </p>
            </div>
          </section>

          {/* Article II */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Article II: Data Collected</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Ministry may collect the following categories of data in the
              course of administering membership and fulfilling its mission:
            </p>
            <div className="space-y-3">
              <div className="rounded-md border p-4 space-y-1">
                <h3 className="font-semibold text-foreground">
                  1. Identity Data
                </h3>
                <p className="text-sm text-muted-foreground">
                  Legal name, preferred name, date of birth, contact information
                  (mailing address, telephone, electronic mail).
                </p>
              </div>
              <div className="rounded-md border p-4 space-y-1">
                <h3 className="font-semibold text-destructive">
                  2. Biological Verification Data
                </h3>
                <p className="text-sm text-muted-foreground">
                  MC1R-functional screening results and related biological data
                  provided during the membership verification process. This data is
                  classified as <strong>Sacred Biological Data</strong> and is
                  subject to the highest level of protection under this Policy.
                </p>
              </div>
              <div className="rounded-md border p-4 space-y-1">
                <h3 className="font-semibold text-foreground">
                  3. Financial Data
                </h3>
                <p className="text-sm text-muted-foreground">
                  Contribution records, payment methods, Investment Pool
                  participation, and Certificate of Beneficial Interest records.
                </p>
              </div>
              <div className="rounded-md border p-4 space-y-1">
                <h3 className="font-semibold text-foreground">
                  4. Communication Data
                </h3>
                <p className="text-sm text-muted-foreground">
                  Correspondence between the Member and the Ministry, participation
                  in Ministry programs, and educational engagement records.
                </p>
              </div>
              <div className="rounded-md border p-4 space-y-1">
                <h3 className="font-semibold text-foreground">
                  5. Covenant Records
                </h3>
                <p className="text-sm text-muted-foreground">
                  Signed Membership Agreement, acknowledgment forms, and related
                  governing instrument records.
                </p>
              </div>
            </div>
          </section>

          {/* Article III */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Article III: Data Storage and Security
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                1. <strong className="text-foreground">Physical Records.</strong>{" "}
                All physical records containing Member data shall be stored in a
                secure location under the direct custody of the Grantor or the
                Board of Trustees. Physical records shall not be stored in
                commercial cloud facilities, third-party storage units, or any
                location outside the Ministry&apos;s direct control.
              </p>
              <p>
                2. <strong className="text-foreground">Digital Records.</strong>{" "}
                All digital records containing Member data shall be encrypted at
                rest and in transit using industry-standard encryption. The Ministry
                shall not store Member data on commercial platforms (including but
                not limited to Google, Meta, Amazon, Microsoft, or Apple cloud
                services) unless such platforms are used solely as encrypted
                containers with no access granted to the platform provider. The
                Ministry shall maintain independent, encrypted backups of all
                digital Member data.
              </p>
              <p>
                3. <strong className="text-foreground">Sacred Biological Data.</strong>{" "}
                MC1R-functional screening data and all biological verification
                records shall be stored separately from general membership records,
                under enhanced security protocols determined by the Research
                Authority. Access to Sacred Biological Data shall be limited to the
                Grantor, the Research Authority, and any individual specifically
                authorized in writing by the Grantor.
              </p>
              <p>
                4. <strong className="text-foreground">Retention.</strong> Member
                data shall be retained for the duration of membership and for a
                period of seven (7) years following termination of membership,
                after which it shall be securely destroyed unless the former Member
                requests earlier destruction or the Ministry is required by its own
                governing instruments to retain specific records.
              </p>
            </div>
          </section>

          {/* Article IV */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Article IV: Data Access and Disclosure
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                1. <strong className="text-foreground">Internal Access.</strong>{" "}
                Member data shall be accessible only to the Grantor, the Board of
                Trustees, and such Officers or agents as are specifically authorized
                by Board resolution for a defined purpose. No blanket access shall
                be granted to any individual.
              </p>
              <p>
                2. <strong className="text-foreground">Member Access.</strong> Every
                Member has the right to review, correct, and receive a complete
                copy of their own data held by the Ministry. Requests shall be
                directed to the Board and fulfilled within thirty (30) days.
              </p>
              <p>
                3. <strong className="text-foreground">Non-Disclosure to External Parties.</strong>{" "}
                The Ministry shall not disclose Member data to any external party,
                including but not limited to government agencies, law enforcement,
                commercial entities, researchers, or other religious organizations,
                except:
              </p>
              <ul className="list-none pl-6 space-y-2">
                <li>
                  (a) With the express written consent of the affected Member;
                </li>
                <li>
                  (b) Pursuant to a lawful court order that has been reviewed by the
                  Board and determined to comply with the Church Audit Procedures
                  Act (26 U.S.C. &sect; 7611) and the First Amendment; or
                </li>
                <li>
                  (c) To prevent imminent physical harm to the Member or another
                  individual.
                </li>
              </ul>
              <p>
                4. <strong className="text-foreground">Member Lists.</strong> The
                Ministry shall <strong className="text-foreground">never</strong>{" "}
                disclose, publish, or make available a list of its Members to any
                external party for any purpose. The identity of Members is private
                and shall remain so.
              </p>
              <p>
                5. <strong className="text-foreground">No Data Mining.</strong> The
                Ministry shall not engage in data mining, behavioral tracking,
                algorithmic profiling, or any form of automated analysis of Member
                data for purposes other than direct Ministry administration.
              </p>
            </div>
          </section>

          {/* Article V */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Article V: Member Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every Member has the following data rights, which are enforceable
              through the Ministry&apos;s internal dispute resolution process:
            </p>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                1. <strong className="text-foreground">Right to Access:</strong> The
                right to review and obtain a complete copy of all data the Ministry
                holds about them.
              </p>
              <p>
                2. <strong className="text-foreground">Right to Correction:</strong>{" "}
                The right to correct any inaccurate data.
              </p>
              <p>
                3. <strong className="text-foreground">Right to Deletion:</strong>{" "}
                The right to request deletion of their data, subject to the
                Ministry&apos;s retention obligations under Article III, Section 4.
              </p>
              <p>
                4. <strong className="text-foreground">Right to Data Portability:</strong>{" "}
                The right to receive their data in a usable format upon request.
              </p>
              <p>
                5. <strong className="text-foreground">Right to Object:</strong> The
                right to object to any specific use of their data and to have such
                objection reviewed by the Board.
              </p>
              <p>
                6. <strong className="text-foreground">Right to Be Informed:</strong>{" "}
                The right to be notified within fourteen (14) days of any breach or
                unauthorized access to their data.
              </p>
            </div>
          </section>

          {/* Article VI */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Article VI: Breach Response
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                1. In the event of any unauthorized access to, disclosure of, or
                loss of Member data, the Grantor shall immediately convene the
                Board to assess the scope and impact of the breach.
              </p>
              <p>
                2. All affected Members shall be notified within fourteen (14) days
                of the breach being discovered, with a description of the data
                affected, the circumstances of the breach, and the steps being
                taken to mitigate harm.
              </p>
              <p>
                3. The Board shall take all reasonable steps to prevent future
                breaches and shall document the incident and response in the
                Ministry&apos;s private records.
              </p>
            </div>
          </section>

          {/* Article VII */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Article VII: Amendments</h2>
            <p className="text-muted-foreground leading-relaxed">
              This Policy may be amended by Board resolution. Members shall be
              notified of any material amendments at least thirty (30) days before
              the amendment takes effect. Continued membership after the effective
              date of an amendment constitutes acceptance of the amended Policy.
            </p>
          </section>

          <div className="divider-gold mx-auto w-24" />

          <div className="text-center space-y-2">
            <p className="text-sm italic text-muted-foreground">
              Your data is your sovereign property. The Ministry is its guardian,
              not its owner.
            </p>
            <p className="text-sm font-semibold text-paan-gold uppercase tracking-wider">
              The Frequency Is the Deed.
            </p>
          </div>
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
          <Link href="/private-status" className="hover:text-foreground">
            Notice of Private Status
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms of Use
          </Link>
        </div>
      </footer>
    </div>
  );
}
