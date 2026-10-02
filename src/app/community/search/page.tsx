import type { Metadata } from "next";
import SearchView from "@/components/community/SearchView";

export const metadata: Metadata = { title: "Search | Vines Connection" };

export default function SearchPage() {
  return <SearchView />;
}
