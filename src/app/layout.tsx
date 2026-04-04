import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Vines Connection | Books & Digital Products by Shawn Cummings",
  description:
    "Explore books and digital products bridging neuromelanin biology, sacred geometry, recursive intelligence, and coherent self-discovery. By Shawn Cummings.",
  keywords: [
    "Shawn Cummings",
    "Vines Connection",
    "Collapse Recursion",
    "neuromelanin",
    "sacred geometry",
    "enneagram",
    "self-improvement",
    "philosophy",
    "books",
  ],
  openGraph: {
    title: "Vines Connection | Books & Digital Products",
    description:
      "Bridging neuromelanin biology, sacred geometry, and recursive intelligence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
