import type { Metadata } from "next";
import { Lora, DM_Mono, Poppins } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/shared/ServiceWorkerRegistration";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: "variable",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your habits and achieve your goals",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${dmMono.variable} ${lora.variable} antialiased`}
    >
      <body className="min-h-svh bg-canvas text-ink">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
