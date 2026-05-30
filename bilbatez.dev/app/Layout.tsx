import { Link, Outlet } from 'react-router-dom';
import ui from '../content/en/ui.json';

function TitleComponent() {
  return (
    <div className="py-4 mt-4 text-center">
      <h1>{ui.title}</h1>
    </div>
  );
}

function NavComponent() {
  return (
    <nav className="grid grid-cols-3 text-center">
      {ui.nav.map((nav, index) => (
        <Link
          key={nav.name}
          to={nav.link}
          className={`py-3.5 ${index + 1 == ui.nav.length ? '' : 'border-r'}`}
        >
          {nav.name}
        </Link>
      ))}
    </nav>
  );
}

function FooterComponent() {
  return (
    <footer className="container mx-auto mt-4 grid grid-cols-1">
      <h2>{ui.footer.heading}</h2>
      <ul>
        {ui.footer.socials.map((social, index) => (
          <li className={index == 0 ? 'mt-4' : 'mt-2'} key={social.name}>
            <Link
              className="inline-flex"
              to={social.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={social.icon}
                width={24}
                height={24}
                alt={social.iconAlt}
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
