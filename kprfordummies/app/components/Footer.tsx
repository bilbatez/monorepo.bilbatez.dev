import { memo } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-5">
      Dibuat oleh
      <Link
        to="/bilbatez.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-hero"
      >
        Bilbatez.dev 👽
      </Link>
    </footer>
  );
}

export default memo(Footer);
