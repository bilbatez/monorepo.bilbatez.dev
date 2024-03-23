import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Bilbatez.dev ( •⩊• )",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-serif container mx-auto">
        <div className="py-4 mt-4 text-center">
          <h1>BILBATEZ.DEV | Wazzup (˵ •̀ ᴗ - ˵ ) ✧</h1>
        </div>
        <nav className="grid grid-cols-4 text-center">
          <Link className="py-3.5" href="/">Intro</Link>
          <Link className="py-3.5" href="/profile">The Story So Far...</Link>
          <Link className="py-3.5" href="/experiences">Stats & EXPs</Link>
          <Link className="py-3.5" href="/projects">Net Stuffs</Link>
        </nav>
        <hr />
        <main className="mt-4">
          {children}
        </main>
        <hr className="mt-4" />
        <footer className="container mx-auto mt-4 grid grid-cols-1">
          <h2>✧ Socials ～(  ■ _ ■  )～ ✧</h2>
          <ul>
            <li className="mt-3">
              <Link className="flex items-center" href="/github" target="_blank">
                <Image src="/assets/github-mark.svg" width={20} height={20} alt="Github Icon" /> 
                <span className="ml-2">Github</span>
              </Link>
            </li>
            <li className="mt-2">
              <Link className="flex items-center" href="/linkedin" target="_blank">
                <Image src={"/assets/linkedin-mark.svg"} width={20} height={20} alt="Linkedin Icon" />
                <span className="ml-2">Linkedin</span>
              </Link>
            </li>
          </ul>
        </footer>
      </body>
    </html>
  );
}
