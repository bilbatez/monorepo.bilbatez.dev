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
        \text{Pokok Pinjaman} \times \text{Suku Bunga Per Tahun}
        \]
    `,
        formulaFunc: (request: LoanRequest) => {
            let principal = request.principal
            let totalMonths: number = request.calculateTotalMonths()
            let initialLoanBalance = principal
            let totalInterest = 0
            let totalPayment = 0
            let periodDate = request.startDate
            let indexOffset = 0
            const paymentSchedules: PaymentSchedule[] = new Array(totalMonths)

            for (let index = 0; index < request.interestPeriod.length; index++) {
                const totalMonthsPeriod = request.interestPeriod[index].period * 12

                const totalInterestPeriod: number = principal * (request.interestPeriod[0].interestRate / 100) * (totalMonths / 12)
                const totalPaymentPeriod: number = principal + totalInterestPeriod
                const monthlyInterest: number = totalInterestPeriod / totalMonths
                const monthlyPayment: number = totalPaymentPeriod / totalMonths
                const monthlyRepayment: number = principal / totalMonths

                for (let index = 0; index < totalMonthsPeriod; index++) {
                    console.log("-----")
                    periodDate = addMonth(request.startDate, index)
                    const finalLoanBalance = (initialLoanBalance - monthlyRepayment) < 0 ? 0 : initialLoanBalance - monthlyRepayment
                    console.log("Final: " + finalLoanBalance)
                    console.log("Offset: " + (indexOffset + index + 1))
                    const paymentSchedule = new PaymentSchedule(indexOffset + index + 1, periodDate, initialLoanBalance, monthlyPayment, monthlyInterest, monthlyRepayment, finalLoanBalance)
                    console.log(paymentSchedule)
                    paymentSchedules[indexOffset + index] = paymentSchedule
                    initialLoanBalance = finalLoanBalance
                    totalInterest += monthlyInterest
                    totalPayment += monthlyPayment
                }

                totalMonths = totalMonths - totalMonthsPeriod
                principal = initialLoanBalance
                indexOffset = indexOffset + totalMonthsPeriod
            }
            console.log(paymentSchedules)

            return new PaymentDetails(paymentSchedules, request.principal, totalInterest, totalPayment)
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
        formulaFunc: (request: LoanRequest) => {
            function calculateEffectiveMonthlyPayment(
                principal: number,
                annualInterestRate: number,
                totalMonths: number
            ): number {
                const monthlyInterestRate = annualInterestRate / 12;
                const numerator = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths);
                const denominator = Math.pow(1 + monthlyInterestRate, totalMonths) - 1;
                return numerator / denominator;
            }
            return new PaymentDetails()
        }
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