import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "optional" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "optional" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "optional" });

export const metadata: Metadata = {
  title: "BTC Ballers - Basketball training in Dallas",
  description: "Believe. Train. Compete. Basketball training in Dallas with Coach T. It's bigger than basketball.",
  metadataBase: new URL("https://btcballers.fit"),
  openGraph: {
    title: "BTC Ballers - Basketball training in Dallas",
    description: "Believe. Train. Compete. It's bigger than basketball.",
    url: "https://btcballers.fit",
    siteName: "BTC Ballers",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BTC Ballers - Basketball training in Dallas",
    description: "Believe. Train. Compete. It's bigger than basketball.",
    images: ["/og-image.png"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-btc-black text-btc-white font-body antialiased">
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
