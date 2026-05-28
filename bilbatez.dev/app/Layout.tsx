import { Link, Outlet } from 'react-router-dom';

function TitleComponent() {
  return (
    <div className="py-4 mt-4 text-center">
      <h1>BILBATEZ.DEV | Wazzup (˵ •̀ ᴗ - ˵ ) ✧</h1>
    </div>
  );
}

function NavComponent() {
  const navs = [
    { name: 'Intro', link: '/' },
    { name: 'Corpo Exp', link: '/experience' },
    { name: 'Prjx', link: '/projects' },
  ];

  return (
    <nav className="grid grid-cols-3 text-center">
      {navs.map((nav, index) => (
        <Link
          key={nav.name}
          to={nav.link}
          className={`py-3.5 ${index + 1 == navs.length ? '' : 'border-r'}`}
        >
          {nav.name}
        </Link>
      ))}
    </nav>
  );
}

function FooterComponent() {
  const socials = [
    {
      name: 'Github',
      image: { source: '/assets/github-mark.svg', alt: 'Github Icon' },
      link: '/github',
    },
    {
      name: 'Linkedin',
      image: { source: '/assets/linkedin-mark.svg', alt: 'Linkedin Icon' },
      link: '/linkedin',
    },
  ];

  return (
    <footer className="container mx-auto mt-4 grid grid-cols-1">
      <h2>✧ Socials ～( ■ _ ■ )～ ✧</h2>
      <ul>
        {socials.map((social, index) => (
          <li className={index == 0 ? 'mt-4' : 'mt-2'} key={social.name}>
            <Link
              className="inline-flex"
              to={social.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={social.image.source}
                width={24}
                height={24}
                alt={social.image.alt}
              />
              <span className="ml-2">{social.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}

export function Layout() {
  return (
    <div className="font-serif container mx-auto">
      <TitleComponent />
      <NavComponent />
      <hr className="mt-2" />
      <main className="mt-4">
        <Outlet />
      </main>
      <hr className="mt-4" />
      <FooterComponent />
    </div>
  );
}
