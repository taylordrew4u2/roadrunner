import "@/styles/globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

export const metadata: Metadata = {
  title: "Roadrunner",
  description: "Shared travel itinerary planner",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const grotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", weight: ["400", "500", "600", "700"] });
  return (
    <html lang="en">
      <body className={`${grotesk.className} min-h-screen bg-base`}>{children}</body>
    </html>
  );
}
