import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Vines Connection",
  description: "Get in touch with Shawn Cummings and Vines Connection.",
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="gradient-hero relative overflow-hidden py-24">
        <div className="orb right-[10%] top-[15%] h-48 w-48 bg-psyche-gold/15" />
        <div
          className="orb left-[10%] bottom-[10%] h-40 w-40 bg-psyche-violet/15"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <span className="mb-4 inline-block text-sm tracking-widest text-psyche-teal uppercase">
            Reach Out
          </span>
          <h1
            className="mb-6 text-5xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Contact
          </h1>
          <p className="text-lg text-text-secondary">
            Questions, collaborations, bulk orders, or speaking inquiries.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-6">
          {/* Links */}
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            <a
              href="https://payhip.com/VinesConnection"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-card flex flex-col items-center rounded-2xl p-8 text-center transition-transform hover:scale-[1.03]"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-psyche-teal/20">
                <svg
                  className="h-7 w-7 text-psyche-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-bold text-text-primary">
                Payhip Store
              </h3>
              <p className="text-sm text-text-secondary">
                Browse and purchase digital products
              </p>
            </a>

            <a
              href="https://www.barnesandnoble.com/w/collapse-recursion-shawn-cummings/1149520866"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-card flex flex-col items-center rounded-2xl p-8 text-center transition-transform hover:scale-[1.03]"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-psyche-gold/20">
                <svg
                  className="h-7 w-7 text-psyche-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-bold text-text-primary">
                Barnes &amp; Noble
              </h3>
              <p className="text-sm text-text-secondary">
                Order the paperback edition
              </p>
            </a>
          </div>

          {/* Contact form placeholder */}
          <div className="gradient-card rounded-2xl p-8 md:p-12">
            <h2
              className="mb-6 text-2xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Send a Message
            </h2>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm text-text-secondary"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full rounded-xl border border-border bg-celestial-800/50 px-4 py-3 text-text-primary placeholder-text-secondary/50 outline-none transition-colors focus:border-psyche-teal"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm text-text-secondary"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full rounded-xl border border-border bg-celestial-800/50 px-4 py-3 text-text-primary placeholder-text-secondary/50 outline-none transition-colors focus:border-psyche-teal"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm text-text-secondary"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full rounded-xl border border-border bg-celestial-800/50 px-4 py-3 text-text-primary outline-none transition-colors focus:border-psyche-teal"
                >
                  <option value="general">General Inquiry</option>
                  <option value="bulk">Bulk Orders</option>
                  <option value="collab">Collaboration</option>
                  <option value="speaking">Speaking</option>
                  <option value="media">Media / Press</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm text-text-secondary"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full rounded-xl border border-border bg-celestial-800/50 px-4 py-3 text-text-primary placeholder-text-secondary/50 outline-none transition-colors focus:border-psyche-teal"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="glow-gold w-full rounded-full bg-gradient-to-r from-psyche-gold to-psyche-teal px-6 py-4 text-lg font-semibold text-celestial-900 transition-transform hover:scale-[1.02]"
              >
                Send Message
              </button>
              <p className="text-center text-xs text-text-secondary">
                Form submissions will be connected once email is configured.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
