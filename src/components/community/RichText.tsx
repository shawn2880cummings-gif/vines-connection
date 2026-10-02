import Link from "next/link";
import type { ReactNode } from "react";

// Turns #hashtags and @mentions inside text into links.
export default function RichText({ text, className = "" }: { text: string; className?: string }) {
  const nodes: ReactNode[] = [];
  const re = /[#@][a-zA-Z0-9_]+/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const prev = m.index > 0 ? text[m.index - 1] : "";
    if (prev && /[\w&]/.test(prev)) continue;
    const tok = m[0];
    const isTag = tok[0] === "#" && /^#[a-zA-Z][a-zA-Z0-9_]{1,29}$/.test(tok);
    const isMention = tok[0] === "@" && /^@[a-zA-Z0-9_]{3,20}$/.test(tok);
    if (!isTag && !isMention) continue;
    if (m.index > last) nodes.push(text.slice(last, m.index));
    nodes.push(
      <Link
        key={m.index}
        href={isTag ? `/community/tag/${tok.slice(1).toLowerCase()}` : `/community/u/${tok.slice(1).toLowerCase()}`}
        className={isTag ? "text-psyche-teal hover:underline" : "text-psyche-gold hover:underline"}
      >
        {tok}
      </Link>
    );
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <span className={`whitespace-pre-wrap break-words ${className}`}>{nodes}</span>;
}
