import type { Metadata } from "next";
import ResetView from "@/components/community/ResetView";

export const metadata: Metadata = { title: "Reset password | Vines Connection", robots: { index: false } };

export default function ResetPage() {
  return <ResetView />;
}
