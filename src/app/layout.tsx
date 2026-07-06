import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import InteractiveBackground from "@/components/InteractiveBackground";
import { PageTransition } from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rahulparajuli.com.np"),
  title: "Dr. Rahul Parajuli | Clinical Researcher",
  description: "Portfolio of Dr. Rahul Parajuli, ECFMG-certified Physician & Clinical Researcher specializing in Critical Care, Pulmonology, and AI in Health.",
  keywords: ["Rahul Parajuli", "Clinical Researcher", "Physician", "Critical Care", "Pulmonology", "Medical Portfolio"],
  authors: [{ name: "Dr. Rahul Parajuli" }],
  openGraph: {
    title: "Dr. Rahul Parajuli | Clinical Researcher",
    description: "Portfolio of Dr. Rahul Parajuli, ECFMG-certified Physician & Clinical Researcher.",
    url: "https://rahulparajuli.com",
    siteName: "Dr. Rahul Parajuli Portfolio",
    images: [
      {
        url: "/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Dr. Rahul Parajuli",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Rahul Parajuli | Clinical Researcher",
    description: "Portfolio of Dr. Rahul Parajuli, ECFMG-certified Physician & Clinical Researcher.",
    images: ["/profile.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 min-h-screen flex flex-col`}
      >
        <MotionConfig reducedMotion="user">
          <InteractiveBackground />
          <Navbar />
          <main className="flex-grow">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <AIAssistant />
        </MotionConfig>
      </body>
    </html>
  );
}
