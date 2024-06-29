import type { Metadata } from "next";
import { PT_Serif } from "next/font/google";
import "./globals.scss";

const ptserif = PT_Serif({
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
      <body className={ptserif.className}>
        {children}
      </body>
    </html>
  );
}
