import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({ variable: "--font-urbanist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SailSwipe — Mobile App Preview",
  description:
    "Interactive prototype of SailSwipe, a mobile app that matches skippers with crew: swipe sailing opportunities, message crew, list gear and read port formalities. Designed by Chris Paynaganan.",
  icons: { icon: "/img/logo.png" },
};

export const viewport: Viewport = { themeColor: "#fdfdfd", width: "device-width", initialScale: 1, maximumScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
