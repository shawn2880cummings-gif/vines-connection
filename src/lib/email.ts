// Transactional email via Resend (https://resend.com). Set RESEND_API_KEY and
// EMAIL_FROM (e.g. "Vines Connection <hello@vinesconnection.info>", on a domain
// verified in Resend). Without a key, email is simply "off": accounts still work
// and verification isn't enforced.

// Local testing only: EMAIL_DEBUG=log prints emails to the server console. Never active in production.
const debugLog = () => process.env.NODE_ENV !== "production" && process.env.EMAIL_DEBUG === "log";

export const emailEnabled = () => debugLog() || Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

export async function sendEmail(opts: { to: string; subject: string; html: string; text: string }): Promise<boolean> {
  if (!emailEnabled()) return false;
  if (debugLog()) {
    console.log(`[email-debug] to=${opts.to} subject=${opts.subject}\n${opts.text}`);
    return true;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [opts.to], subject: opts.subject, html: opts.html, text: opts.text }),
    });
    if (!res.ok) console.error("Resend error:", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (error) {
    console.error("Resend request failed:", error);
    return false;
  }
}

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
}

function shell(title: string, body: string, buttonLabel: string, url: string, footnote: string) {
  return `<!doctype html><html><body style="margin:0;background:#0a0a14;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="480" style="max-width:480px;background:#12142a;border:1px solid #2a2d52;border-radius:20px;padding:32px">
<tr><td style="color:#20c9b0;font-size:12px;letter-spacing:3px">VINES CONNECTION</td></tr>
<tr><td style="color:#fff;font-size:24px;font-weight:700;padding:12px 0 8px">${esc(title)}</td></tr>
<tr><td style="color:#b8bcd8;font-size:15px;line-height:1.6;padding-bottom:24px">${body}</td></tr>
<tr><td><a href="${esc(url)}" style="display:inline-block;background:linear-gradient(90deg,#20c9b0,#f0a830);color:#0a0a14;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:999px">${esc(buttonLabel)}</a></td></tr>
<tr><td style="color:#7d82a8;font-size:12px;line-height:1.5;padding-top:24px">${footnote}<br><br>Button not working? Paste this link into your browser:<br><span style="word-break:break-all;color:#9aa0c8">${esc(url)}</span></td></tr>
</table></td></tr></table></body></html>`;
}

export function verifyEmail(name: string, url: string) {
  return {
    subject: "Confirm your email — Vines Connection",
    html: shell(
      `Welcome, ${name}`,
      "Confirm your email to finish setting up your Circle account. This link works for 24 hours.",
      "Confirm my email",
      url,
      "If you didn't create this account, you can ignore this message."
    ),
    text: `Welcome, ${name}!\n\nConfirm your email (valid 24 hours):\n${url}\n\nIf you didn't create this account, ignore this message.`,
  };
}

export function resetEmail(name: string, url: string) {
  return {
    subject: "Reset your password — Vines Connection",
    html: shell(
      "Reset your password",
      `Hi ${esc(name)}, use the button below to choose a new password. This link works for 1 hour and can be used once.`,
      "Choose a new password",
      url,
      "If you didn't ask for this, you can safely ignore it — your password won't change."
    ),
    text: `Hi ${name},\n\nChoose a new password (valid 1 hour, one use):\n${url}\n\nIf you didn't ask for this, ignore this message.`,
  };
}
