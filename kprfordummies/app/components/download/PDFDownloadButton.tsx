import { DateUtils } from "@/app/_utils";
import { PaymentDetails } from "@/types/formula";
import { memo } from "react";

interface Props {
    paymentDetails: PaymentDetails
}

// TODO: react-pdf doesn't support React 19 RC yet
function PDFDownloadButton({ paymentDetails }: Props) {

    function generatePdfFilename(): string {
        const currentDate = new Date()
        return `jadwalamortisasi_${DateUtils.htmlInputFormat(currentDate)}_${currentDate.getTime()}.pdf`
    }

    function PDFDoc() {
        return (
            <></>
        )
    }

    return (
        <>
        </>
    )
}

export default memo(PDFDownloadButton)