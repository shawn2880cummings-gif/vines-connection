import { NextResponse } from "next/server";

// Server-side relay to MailerLite so the API key is never exposed to the client.
const MAILERLITE_ENDPOINT = "https://connect.mailerlite.com/api/subscribers";

export async function POST(req: Request) {
  try {
    const { name, email, website, groupId } = await req.json();

    // Honeypot: real users never fill the hidden "website" field — bots do.
    // Silently accept so the bot thinks it succeeded.
    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!email || typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const apiKey = process.env.MAILERLITE_API_KEY;
    if (!apiKey) {
      console.error("MAILERLITE_API_KEY is not set in the environment.");
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const res = await fetch(MAILERLITE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        ...(name ? { fields: { name } } : {}),
        ...(groupId ? { groups: [String(groupId)] } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("MailerLite error:", res.status, detail);
      return NextResponse.json(
        { error: "Subscription failed. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("subscribe route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
