import Link from "next/link";
import { memo } from "react";

function Footer() {
  return (
    <footer className="mt-5">
      Dibuat oleh
      <Link href={"bilbatez.dev"} target="_blank" className="footer-hero">
        Bilbatez.dev 👽
      </Link>
    </footer>
  );
}

export default memo(Footer);
