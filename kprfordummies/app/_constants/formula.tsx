import { AvailableFormula, LoanRequest, PaymentDetails, PaymentSchedule } from "@/types/formula";
import { InterestType } from "@/types/interest";
import { addMonth } from "../_utils/date";


export const INTEREST_FORMULAS: AvailableFormula = {
    [InterestType.NONE]: {
        display: '',
        formulaFunc: (_request: LoanRequest) => { return undefined }
    },
    [InterestType.FLAT]: {
        display: String.raw`
    \[\text{Bunga Per Bulan} = 
        \frac{\text{Pokok Pinjaman} \times \text{Suku Bunga Per Tahun} \times \text{Jumlah Tahun Jangka Waktu Kredit}}
        {\text{Jumlah Bulan Dalam Jangka Waktu Kredit}}
        \]
    `,
        formulaFunc: (request: LoanRequest) => {
            const totalMonths: number = request.calculateTotalMonths()
            const totalInterest: number = request.principal * (request.interestPeriod[0].interestRate / 100) * (totalMonths / 12)
            const totalRepayment: number = request.principal + totalInterest
            const monthlyInterest: number = totalInterest / totalMonths
            const monthlyPayment: number = totalRepayment / totalMonths
            const monthlyRepayment: number = request.principal / totalMonths

            let initialLoanBalance = request.principal

            const paymentSchedules: PaymentSchedule[] = []
            for (let index = 0; index < totalMonths; index++) {
                const periodDate = addMonth(request.startDate, index)
                const finalLoanBalance = initialLoanBalance - monthlyRepayment
                const paymentSchedule = new PaymentSchedule(index + 1, periodDate, initialLoanBalance, monthlyPayment, monthlyInterest, monthlyRepayment, finalLoanBalance)
                paymentSchedules.push(paymentSchedule)
                initialLoanBalance = finalLoanBalance
            }

            return new PaymentDetails(paymentSchedules, totalInterest, totalRepayment)
        }
    },
    [InterestType.EFFECTIVE]: {

        display: String.raw`
    \[\text{Bunga Per Bulan} = 
        \text{Sisa Pokok Pinjaman Bulan Sebelumnya}
        \times
        \text{Suku Bunga Per Tahun}
        \times
        \frac{\text{Jumlah Hari Sebulan}}{\text{Jumlah Hari Dalam Setahun}}
        \]
    `,
        formulaFunc: (request: LoanRequest) => { return new PaymentDetails() }
    },
    [InterestType.ANNUITY]: {
        display: String.raw`
    \[\text{Bunga Per Bulan} = 
        \text{Sisa Pokok Pinjaman Bulan Sebelumnya}
        \times
        \text{Suku Bunga Per Tahun}
        \times
        \frac{\text{Jumlah Hari Sebulan}}{\text{Jumlah Hari Dalam Setahun}}
        \]
    `,
        formulaFunc: (request: LoanRequest) => { return new PaymentDetails() }
    },
    [InterestType.FLOATING]: {
        display: '',
        formulaFunc: (request: LoanRequest) => { return new PaymentDetails() }
    }
}