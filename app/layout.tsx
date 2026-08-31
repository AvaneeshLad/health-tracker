import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DAILY TRACKER | Winter Arc Discipline",
  description:
    "A cold, dark, minimalistic daily habit tracker built around discipline, consistency, and unbroken streaks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-background text-cold-100 antialiased font-sans selection:bg-cold-ice selection:text-black">
        <AuthProvider>
          <div className="relative min-h-screen flex flex-col">
            {/* Subtle background ambient grid */}
            <div
              className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
              style={{
                backgroundImage: `radial-gradient(#94A3B8 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex-1 flex flex-col">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
