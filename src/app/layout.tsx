import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import "./globals.css";

import Header from "@salah-tours/components/header/Header";
import Footer from "@salah-tours/components/footer/Footer";
import StyledComponentsRegistry from "@salah-tours/components/ui/styled.registry";

const Montserrat = localFont({
  src: "../assets/fonts/Montserrat-Regular.ttf",
  variable: "--font-montserrat",
  weight: "100 400",
});

const MontserratBold = localFont({
  src: "../assets/fonts/Montserrat-Bold.ttf",
  variable: "--font-montserrat-bold",
  weight: "500 700",
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
        className={`${Montserrat.variable} ${MontserratBold.variable} antialiased`}
      >
        <StyledComponentsRegistry>
          <AppRouterCacheProvider>
            <Header />
            {children}
            <Footer />
          </AppRouterCacheProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
