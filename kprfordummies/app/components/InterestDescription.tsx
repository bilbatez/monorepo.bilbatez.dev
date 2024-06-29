import { memo, useContext } from "react"
import { CurrentInterestTypeContext } from "../context"
import { CurrentInterestType } from "@/types/context"
import InterestFormula from "./InterestFormula"
import { INTERESTS } from "../_constants/interest"

function InterestDescription() {

    const { currentInterestType }: CurrentInterestType = useContext(CurrentInterestTypeContext)

    return (
        <div className="mb-12">
            {INTERESTS[currentInterestType].display?.description}
            <InterestFormula />
        </div>
    )
}

export default memo(InterestDescription)