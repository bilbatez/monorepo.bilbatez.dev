import { CurrentInterestType } from "@/types/context"
import { memo, useContext } from "react"
import { INTERESTS } from "../_constants/interest"
import { CurrentInterestTypeContext } from "../context"
import InterestFormula from "./InterestFormula"

function InterestDescription() {

    const { currentInterestType }: CurrentInterestType = useContext(CurrentInterestTypeContext)

    return (
        <div className="mb-5">
            <span className="block mb-3">
                {INTERESTS[currentInterestType].display?.description}
            </span>
            <InterestFormula />
        </div>
    )
}

export default memo(InterestDescription)