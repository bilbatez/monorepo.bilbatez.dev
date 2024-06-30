import { MathJax } from "better-react-mathjax";
import { memo, useContext } from "react";
import { INTEREST_FORMULAS } from "../_constants/formula";
import { CurrentInterestTypeContext } from "../context";

function InterestFormula() {

    const {
        currentInterestType
    } = useContext(CurrentInterestTypeContext)

    return (
        <MathJax>
            <div className="relative overflow-x-auto overflow-y-hidden">
                {INTEREST_FORMULAS[currentInterestType].display}
            </div>
        </MathJax>
    )
}

export default memo(InterestFormula)