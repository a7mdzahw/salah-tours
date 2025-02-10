import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

import { Providers } from "./providers";

const exoFont = localFont({
  src: "../assets/fonts/Exo2.ttf",
  variable: "--font-exo2",
  weight: "100 400 700",
});

const exoItalicFont = localFont({
  src: "../assets/fonts/Exo2-Italic.ttf",
  variable: "--font-exo2-italic",
  weight: "100 400 700",
});

export const metadata: Metadata = {
  title: "Salah Tours",
  description: "Best Tours in the World",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${exoFont.variable} ${exoItalicFont.variable} antialiased font-exo2`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
