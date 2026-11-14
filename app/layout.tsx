import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Anek_Malayalam } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const anekMalayalam = Anek_Malayalam({
  subsets: ["malayalam", "latin"],
  variable: "--font-malayalam",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0d3b27",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "PVS Ayurvedics | Pure Ayurvedic Care & Herbal Products Manjeri Kerala",
  description:
    "Discover authentic Kerala Ayurvedic consultations, personalized treatments, and pure herbal formulations in Manjeri, Malappuram, Kerala.",
  keywords: [
    "PVS Ayurvedics",
    "Ayurvedic clinic Manjeri",
    "Ayurvedic products Malappuram",
    "Kerala Ayurveda",
    "Herbal Hair Oil",
    "Ayurvedic consultation",
    "Panchakarma Kerala",
  ],
  authors: [{ name: "PVS Ayurvedics" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "PVS Ayurvedics | Traditional Care • Modern Wellbeing",
    description: "Pure. Natural. Everyday Wellness. Bringing the wisdom of Ayurveda to your everyday life in Manjeri, Kerala.",
    url: "https://pvsayurvedics.com",
    siteName: "PVS Ayurvedics",
    images: [
      {
        url: "/images/hero-ayurvedic.svg",
        width: 1200,
        height: 630,
        alt: "PVS Ayurvedics Manjeri Kerala",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${playfairDisplay.variable} ${anekMalayalam.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-ayur-cream text-stone-800">
        {children}
      </body>
    </html>
  );
}
