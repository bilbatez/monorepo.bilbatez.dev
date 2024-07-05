import { LoanRequest, PaymentDetails, PaymentSchedule } from "@/types/formula"
import { InterestType } from "@/types/interest"
import { DateUtils } from "."

function generateAmortizationTableWithFlatInterestRate(request: LoanRequest): PaymentDetails {
    let currentPrincipal = request.principal
    let totalMonths: number = request.calculateTotalMonths()
    let initialLoanBalance = currentPrincipal
    let totalInterest = 0
    let totalPayment = 0
    let indexOffset = 0
    const paymentSchedules: PaymentSchedule[] = new Array(totalMonths)

    for (let index = 0; index < request.interestPeriod.length; index++) {
        const totalMonthsPeriod = request.interestPeriod[index].period * 12

        const totalInterestPeriod: number = currentPrincipal * (request.interestPeriod[0].interestRate / 100) * (totalMonths / 12)
        const totalPaymentPeriod: number = currentPrincipal + totalInterestPeriod
        const monthlyInterest: number = totalInterestPeriod / totalMonths
        const monthlyPayment: number = totalPaymentPeriod / totalMonths
        const monthlyRepayment: number = currentPrincipal / totalMonths

        for (let index = 0; index < totalMonthsPeriod; index++) {
            const periodDate = DateUtils.addMonth(request.startDate, index + indexOffset)
            const finalLoanBalance = (initialLoanBalance - monthlyRepayment) < 0 ? 0 : initialLoanBalance - monthlyRepayment
            const paymentSchedule = new PaymentSchedule(indexOffset + index + 1, periodDate, initialLoanBalance, monthlyPayment, monthlyInterest, monthlyRepayment, finalLoanBalance)
            paymentSchedules[indexOffset + index] = paymentSchedule
            initialLoanBalance = finalLoanBalance
            totalInterest += monthlyInterest
            totalPayment += monthlyPayment
        }

        totalMonths -= totalMonthsPeriod
        indexOffset += totalMonthsPeriod
        currentPrincipal = initialLoanBalance
    }

    return new PaymentDetails(paymentSchedules, request.principal, totalInterest, totalPayment)
}

function generateAmortizationTableWithEffectiveInterestRate(request: LoanRequest): PaymentDetails {
    const totalMonths = request.calculateTotalMonths()
    const monthlyRepayment = request.principal / totalMonths

    let currentPrincipal = request.principal
    let totalPaidInterest = 0

    let indexOffset = 0

    let initialLoanBalance = currentPrincipal

    const paymentSchedules = new Array(totalMonths)

    for (let index = 0; index < request.interestPeriod.length; index++) {
        const totalMonthsPeriod = request.interestPeriod[index].period * 12
        const monthlyInterestRate = request.interestPeriod[index].interestRate / 12 / 100

        for (let index = 0; index < totalMonthsPeriod; index++) {
            const periodDate = DateUtils.addMonth(request.startDate, index + indexOffset)
            const monthlyInterest = initialLoanBalance * monthlyInterestRate
            const monthlyPayment = monthlyRepayment + monthlyInterest

            const finalLoanBalance = initialLoanBalance - monthlyRepayment
            const paymentSchedule = new PaymentSchedule(index + indexOffset + 1, periodDate, initialLoanBalance, monthlyPayment, monthlyInterest, monthlyRepayment, finalLoanBalance)
            paymentSchedules[index + indexOffset] = paymentSchedule

            initialLoanBalance = finalLoanBalance
            totalPaidInterest += monthlyInterest
        }
        indexOffset += totalMonthsPeriod
    }
    const totalPaid = request.principal + totalPaidInterest

    return new PaymentDetails(paymentSchedules, request.principal, totalPaidInterest, totalPaid)
}

export function generateAmortizationTable(loanRequest: LoanRequest, interestType: InterestType): PaymentDetails {
    switch (interestType) {
        case InterestType.FLAT:
            return generateAmortizationTableWithFlatInterestRate(loanRequest)
        case InterestType.EFFECTIVE:
            return generateAmortizationTableWithEffectiveInterestRate(loanRequest)
        default:
            return new PaymentDetails()
    }
}