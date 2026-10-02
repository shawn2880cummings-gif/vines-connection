import type { Metadata } from "next";
import NotificationsView from "@/components/community/NotificationsView";

export const metadata: Metadata = { title: "Activity | Vines Connection" };

export default function NotificationsPage() {
  return <NotificationsView />;
}
