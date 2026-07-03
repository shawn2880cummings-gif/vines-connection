import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollText, ArrowLeft } from "lucide-react";

export default function PrimarySourceEvidencePreviewStub() {
  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <ScrollText className="h-10 w-10 text-paan-gold" />
      <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
        Primary Source Evidence Archive
      </h1>
      <p className="max-w-md text-muted-foreground">
        The live evidence archive is served from the Ministry database and is
        not part of this design preview. It is unchanged by the redesign.
      </p>
      <Link href="/research">
        <Button variant="outline" className="border-paan-gold/40 text-paan-gold hover:bg-paan-gold/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Research
        </Button>
      </Link>
    </div>
  );
}
