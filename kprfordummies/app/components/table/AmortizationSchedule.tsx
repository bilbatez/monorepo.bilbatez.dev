import { INTEREST_FORMULAS } from "@/app/_constants/formula"
import { CurrentFormDataContext, CurrentInterestTypeContext } from "@/app/context"
import { PaymentDetails } from "@/types/formula"
import { memo, useContext, useMemo } from "react"
import AmortizationScheduleTable from "./AmortizationScheduleTable"

function AmortizationSchedule() {
    const { currentInterestType } = useContext(CurrentInterestTypeContext)
    const { currentFormData } = useContext(CurrentFormDataContext)
    const paymentDetails: PaymentDetails | undefined = useMemo(
        () => currentFormData && INTEREST_FORMULAS[currentInterestType].formulaFunc(currentFormData)
        , [currentFormData, currentInterestType])

    return (
        <div className="min-h-2">
            {paymentDetails && (<AmortizationScheduleTable paymentDetails={paymentDetails} />)}
        </div>
    )
}

export default memo(AmortizationSchedule)