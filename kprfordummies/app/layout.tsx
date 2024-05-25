import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.scss";
import Link from "next/link";
import Image from "next/image";

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

  function TitleComponent() {
    return (
      <div>
        <Link href='/' className="inline-flex items-center">
          <Image src='/assets/house.svg' width={40} height={40} alt='house icon' className="mr-2" />
          <h1 className="text-2xl font-bold">KPR for Dummies</h1>
        </Link>
        <div>
          Simulasikan Pinjamanmu!
        </div>
      </div>
    )
  }

  function FooterComponent() {
    return (
      <>
        <div className="mt-4">
          Made by
          <Link href={"bilbatez.dev"}
            target="_blank"
            className="footer-hero">
            Bilbatez.dev
          </Link>
        </div>
      </>

    )
  }

  return (
    <html lang="id">
      <body className={merriweather.className}>
        <TitleComponent />
        {children}
        <FooterComponent />
      </body>
    </html>
  );
}
