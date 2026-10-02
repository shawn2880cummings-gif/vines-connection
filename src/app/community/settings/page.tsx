import type { Metadata } from "next";
import SettingsView from "@/components/community/SettingsView";

export const metadata: Metadata = { title: "Edit profile | Vines Connection" };

export default function SettingsPage() {
  return <SettingsView />;
}
