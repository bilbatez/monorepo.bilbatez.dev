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
            {INTEREST_FORMULAS[currentInterestType].display}
        </MathJax>
    )
}

export default memo(InterestFormula)