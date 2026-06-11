import type { Metadata } from "next";
import CinematicExperience from "@/components/cinematic/CinematicExperience";

export const metadata: Metadata = {
  title: "Vines Connection | Cinematic Experience",
  description:
    "A cinematic 3D scroll journey through neuromelanin biology, sacred geometry, and recursive intelligence.",
};

export default function CinematicPage() {
  return <CinematicExperience />;
}
