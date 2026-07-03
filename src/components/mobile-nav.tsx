"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#research", label: "Research" },
  { href: "#statement-of-faith", label: "Statement of Faith" },
  { href: "/private-status", label: "Private Status" },
  { href: "/privacy", label: "Privacy" },
  { href: "#contact", label: "Contact" },
  { href: "#contribute", label: "Contribute" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="text-paan-cream hover:bg-white/10"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-paan-earth/95 backdrop-blur-md border-b border-paan-gold/20 z-50">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-paan-cream/80 hover:text-paan-gold py-2 px-3 rounded-md hover:bg-white/5 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 border-t border-paan-gold/20 mt-2">
              <Link href="/apply" className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-paan-gold/40 text-paan-gold hover:bg-paan-gold/10"
                >
                  Apply
                </Button>
              </Link>
              <Link href="/login" className="flex-1">
                <Button
                  size="sm"
                  className="w-full bg-paan-green hover:bg-paan-green-light text-paan-cream"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
