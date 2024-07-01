import { INTEREST_FORMULAS } from "@/app/_constants/formula"
import { CurrencyUtils } from "@/app/_utils"
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

    return paymentDetails && (
        <div className="mt-10">
            <h1 className="text-center text-xl font-bold mb-5">Jadwal Amortisasi</h1>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 max-w-md">
                <div>Pokok Pinjaman:</div>
                <div className="font-bold">{CurrencyUtils.format(paymentDetails.totalPrincipal)}</div>
                <div>Total Bunga yang dibayarkan: </div>
                <div className="font-bold">{CurrencyUtils.format(paymentDetails.totalPaidInterest)}</div>
                <div>Total Keseluruhan: </div>
                <div className="font-bold">{CurrencyUtils.format(paymentDetails.totalPaid)}</div>
            </div>
            {paymentDetails && (<AmortizationScheduleTable paymentDetails={paymentDetails} />)}
        </div>
    )
}

export default memo(AmortizationSchedule)