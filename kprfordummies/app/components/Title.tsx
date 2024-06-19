import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

function Title() {
    return (
        <div>
            <Link href="/" className="inline-flex items-center">
                <Image src="/assets/house.svg" width={40} height={40} alt="house icon" className="mr-2" />
                <h1 className="text-2xl font-bold">Kalkulator KPR</h1>
            </Link>
            <div>
                Simulasikan Pinjamanmu!
            </div>
        </div>
    )
}

export default memo(Title)