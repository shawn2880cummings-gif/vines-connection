import React from "react";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/button";

export function DeclarationSection() {
  return (
    <section id="declaration-notice" className="border-b border-border/40 bg-paan-earth/10">
      <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
        <AnimatedSection className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#0a1510] to-black border border-paan-gold/30 rounded-2xl p-8 sm:p-14 text-center shadow-[0_0_40px_rgba(201,168,76,0.15)] relative overflow-hidden group">
            {/* Top border highlight */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-paan-gold to-transparent opacity-70"></div>
            
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-paan-gold/10 text-paan-gold ring-1 ring-paan-gold/30 group-hover:bg-paan-gold/20 transition-colors duration-300">
                <Shield className="h-8 w-8" />
              </div>
            </div>
            
            <p className="text-paan-gold font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-4">
              Official Notice
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Declaration of Existence
            </h2>
            
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Ecclesiastical institution of the MUUR people — the Aboriginal American Source — now in formal, active operation. 
              Read the full articles governing the spiritual, biological, and philosophical framework of the Ministry.
            </p>
            
            <Link href="/declaration">
              <Button 
                size="lg" 
                className="bg-paan-gold hover:bg-paan-gold-light text-black font-semibold px-10 h-14 text-base sm:text-lg w-full sm:w-auto shadow-lg shadow-paan-gold/20 transition-all hover:scale-105"
              >
                Read Full Declaration
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
