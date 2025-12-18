import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Roadrunner",
  description: "Shared travel itinerary planner",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const inter = Inter({ subsets: ["latin"], display: "swap" });
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}
