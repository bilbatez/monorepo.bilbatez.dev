import { memo, useContext } from "react";
import { CurrentInterestTypeContext } from "../context";
import { MathJax } from "better-react-mathjax";
import { INTEREST_FORMULAS } from "../_constants/formula";

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