import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: `Contact | ${APP_NAME}`,
  description:
    "Contact The Private Aboriginal American National PMA Church Ministry.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="sacred-pattern border-b bg-paan-green py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-paan-cream sm:text-5xl">
            Contact
          </h1>
          <div className="divider-gold mx-auto mt-6 w-24" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-paan-sand">
            Reach the public office of {APP_NAME}
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 bg-background py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Contact Information */}
            <div className="space-y-8 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-paan-green">
                    Ministry Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a
                      href="mailto:paan.org@proton.me"
                      className="mt-1 inline-block text-paan-green underline underline-offset-4 hover:text-paan-gold"
                    >
                      paan.org@proton.me
                    </a>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-lg border border-paan-gold/20 bg-paan-cream/30 px-5 py-4 text-xs text-muted-foreground leading-relaxed">
                <p className="font-medium text-foreground">Privacy Notice</p>
                <p className="mt-1">
                  This Ministry is a Private Membership Association. All
                  correspondence submitted through this form is directed to the
                  Ministry&apos;s administrative office.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
