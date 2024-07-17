import { FormulaUtils } from "@/app/_utils"
import { CurrentFormDataContext, CurrentInterestTypeContext } from "@/app/context"
import { PaymentDetails } from "@/types/formula"
import { InterestType } from "@/types/interest"
import { memo, useContext, useMemo } from "react"
import PDFDownloadButton from "../download/PDFDownloadButton"
import AmortizationScheduleTable from "./AmortizationScheduleTable"
import AmortizationTotalSummary from "./AmortizationTotalSummary"

function AmortizationSchedule() {
    const { currentInterestType } = useContext(CurrentInterestTypeContext)
    const { currentFormData } = useContext(CurrentFormDataContext)

    const paymentDetails: PaymentDetails | undefined = useMemo(
        () => {
            if (InterestType.NONE != currentInterestType && !!currentFormData) {
                return FormulaUtils.generateAmortizationTable(currentFormData, currentInterestType)
            }
        }
        , [currentFormData, currentInterestType])

    return paymentDetails && (
        <div className="my-5">
            <h1 className="text-center text-xl font-bold mb-3">Jadwal Amortisasi</h1>
            <AmortizationTotalSummary paymentDetails={paymentDetails} />
            <PDFDownloadButton paymentDetails={paymentDetails} />
            {paymentDetails && (<AmortizationScheduleTable paymentDetails={paymentDetails} />)}
        </div>
    )
}

export default memo(AmortizationSchedule)