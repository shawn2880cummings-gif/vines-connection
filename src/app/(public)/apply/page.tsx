import { Suspense } from "react";
import { ApplyForm } from "./apply-form";

export const metadata = {
  title: "Apply for Membership — PAAN",
  description:
    "Apply for membership in The Private Aboriginal American National PMA Church Ministry.",
};

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <ApplyForm />
    </Suspense>
  );
}
