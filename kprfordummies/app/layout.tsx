import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.scss";
import Footer from "./components/Footer";
import Title from "./components/Title";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "KPR for Dummies",
  description: "Hitung simulasi KPR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={merriweather.className}>
        <Title />
        {children}
        <Footer />
      </body>
    </html>
  );
}
