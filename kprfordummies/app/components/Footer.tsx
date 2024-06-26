import Link from "next/link";
import { memo } from "react";

function Footer() {
    return (
        <div className="mt-4">
            Dibuat oleh
            <Link href={"bilbatez.dev"}
                target="_blank"
                className="footer-hero">
                Bilbatez.dev 👽
            </Link>
        </div>
    )
}

export default memo(Footer)