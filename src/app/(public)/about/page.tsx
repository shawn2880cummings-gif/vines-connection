import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About | ${APP_NAME}`,
  description:
    "Learn about the Private Aboriginal American National PMA Church Ministry, a Free Church operating under 26 U.S.C. § 508(c)(1)(A).",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="sacred-pattern border-b bg-paan-green py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-paan-cream sm:text-5xl">
            About {APP_NAME}
          </h1>
          <div className="divider-gold mx-auto mt-6 w-24" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-paan-sand">
            The Private Aboriginal American National PMA Church Ministry
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 bg-background py-16">
        <div className="container mx-auto max-w-4xl space-y-10 px-4">
          {/* Free Church Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-paan-green">
                A Free Church Under Federal Law
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {APP_NAME} operates as a Free Church under{" "}
                <strong className="text-foreground">
                  26 U.S.C. &sect; 508(c)(1)(A)
                </strong>
                , which provides automatic tax-exempt status to churches, their
                integrated auxiliaries, and conventions or associations of
                churches. This ministry is{" "}
                <strong className="text-foreground">not</strong> a 501(c)(3)
                organization and has not applied for, nor requires, IRS
                determination of exempt status.
              </p>
              <p>
                As a Free Church, PAAN exercises its inherent ecclesiastical
                authority independent of governmental licensing or oversight,
                consistent with the protections afforded under the First
                Amendment to the United States Constitution.
              </p>
            </CardContent>
          </Card>

          {/* Private Membership Association */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-paan-green">
                Private Membership Association
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                PAAN is structured as a{" "}
                <strong className="text-foreground">
                  Private Membership Association (PMA)
                </strong>
                . It is not a public accommodation, public charity, or
                government-regulated entity. Membership is extended by
                invitation and mutual agreement, and all members voluntarily
                enter into private contractual fellowship.
              </p>
              <p>
                The rights of association, privacy, and religious exercise
                observed by this ministry are protected under both common law
                and constitutional principles. The internal affairs of PAAN are
                governed exclusively by its own bylaws, articles of faith, and
                ecclesiastical authority.
              </p>
            </CardContent>
          </Card>

          {/* Founding Principles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-paan-green">
                Founding Principles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                This ministry was founded upon three immovable pillars:
              </p>
              <ul className="ml-6 list-disc space-y-3">
                <li>
                  <strong className="text-foreground">Equity</strong> &mdash;
                  the recognition that every living soul possesses inherent
                  standing and dignity, not granted by statute but by divine
                  origin.
                </li>
                <li>
                  <strong className="text-foreground">
                    Biological Truth
                  </strong>{" "}
                  &mdash; the affirmation that observable, measurable biological
                  reality forms the foundation of identity, health, and natural
                  order.
                </li>
                <li>
                  <strong className="text-foreground">Divine Order</strong>{" "}
                  &mdash; the understanding that creation follows coherent,
                  recursive patterns established by the Creator, and that
                  alignment with these patterns is the path to wholeness.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Notice */}
          <div className="rounded-lg border border-paan-gold/30 bg-paan-cream/50 px-6 py-5 text-center text-sm text-muted-foreground">
            <p>
              Internal governance, membership rolls, financial records, and
              ecclesiastical proceedings are private matters and are not
              disclosed publicly. For inquiries, please visit our{" "}
              <a
                href="/contact"
                className="font-medium text-paan-green underline underline-offset-4 hover:text-paan-gold"
              >
                Contact
              </a>{" "}
              page.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
