import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEON JARVIS AI // Futuristic Personal Operating System",
  description:
    "Cinematic sci-fi AI assistant with animated holographic AI face, multilingual voice intelligence (Urdu, English, Punjabi), real-time web search, and YouTube voice control.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} bg-[#030712] text-slate-100 antialiased min-h-screen selection:bg-cyan-500 selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
