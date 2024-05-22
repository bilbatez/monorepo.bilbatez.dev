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

  function TitleComponent() {
    return (
      <div className="py-4 mt-4 text-center">
        <h1>BILBATEZ.DEV | Wazzup (˵ •̀ ᴗ - ˵ ) ✧</h1>
      </div>
    )
  }

  function NavComponent() {
    const navs = [
      {
        name: 'Intro',
        link: '/',
      },
      {
        name: 'Prjx',
        link: '/projects',
      }
    ]

    return (
      <nav className="grid grid-cols-2 text-center">
        {
          navs.map((nav, index, navs) => {
            return (
              <Link key={nav.name} href={nav.link} className={`py-3.5 ${(index + 1 == navs.length) || 'border-r'}`}>
                {nav.name}
              </Link>
            )
          })
        }
      </nav >
    )
  }

  function FooterComponent() {
    function SocialsComponent() {
      const socials = [
        {
          name: 'Github',
          image: {
            source: '/assets/github-mark.svg',
            alt: 'Github Icon',
          },
          link: '/github',
        },
        {
          name: 'Linkedin',
          image: {
            source: '/assets/linkedin-mark.svg',
            alt: 'Linkedin Icon',
          },
          link: '/linkedin',
        }
      ]

      return (
        <>
          <h2>✧ Socials ～(  ■ _ ■  )～ ✧</h2>
          <ul>
            {socials.map((social, index) => {
              return (
                <li className={index == 0 ? 'mt-4' : 'mt-2'} key={social.name}>
                  <Link className="inline-flex" href={social.link} target="_blank">
                    <Image src={social.image.source} width={24} height={24} alt={social.image.alt} />
                    <span className="ml-2">{social.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      )
    }

    return (
      <footer className="container mx-auto mt-4 grid grid-cols-1">
        <SocialsComponent />
      </footer>
    )
  }

  return (
    <html lang="en">
      <body className="font-serif container mx-auto">
        <TitleComponent />
        <NavComponent />
        <hr className="mt-2" />
        <main className="mt-4">
          {children}
        </main>
        <hr className="mt-4" />
        <FooterComponent />
      </body>
    </html>
  );
}
