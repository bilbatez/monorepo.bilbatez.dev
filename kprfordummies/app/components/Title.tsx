import Image from "next/image";
import Link from "next/link";
import { memo, useContext } from "react";
import { CurrentInterestTypeContext } from "../context";
import { CurrentInterestType } from "@/types/context";
import { InterestType } from "@/types/interest";

function Title() {
    const { setCurrentInterestType }: CurrentInterestType = useContext(CurrentInterestTypeContext)

    function handleClick() {
        setCurrentInterestType(InterestType.NONE)
    }

    return (
        <div>
            <Link href="/" className="inline-flex items-center" onClick={handleClick}>
                <Image src="/assets/house.svg" width={40} height={40} alt="house icon" className="mr-2" />
                <h1 className="text-2xl font-bold">Kalkulator KPR</h1>
            </Link>
        </div>
    )
}

export default memo(Title)