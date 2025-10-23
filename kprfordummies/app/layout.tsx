import type { Metadata } from 'next';
import './globals.scss';
export const metadata: Metadata = {
  title: 'KPR for Dummies',
  description: 'Hitung simulasi KPR',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-serif">{children}</body>
    </html>
  );
}
