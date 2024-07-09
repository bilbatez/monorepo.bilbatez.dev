import { LoanRequest, PaymentDetails, PaymentSchedule } from "@/types/formula"
import { InterestType } from "@/types/interest"
import { DateUtils } from "."

function generateAmortizationTableWithFlatInterestRate(request: LoanRequest): PaymentDetails {
    let totalMonths: number = request.calculateTotalMonths()
    let initialLoanBalance = request.principal
    let totalPaidInterest = 0
    let totalPaid = 0
    let indexOffset = 0
    const paymentSchedules: PaymentSchedule[] = new Array(totalMonths)

    for (let index = 0; index < request.interestPeriod.length; index++) {
        const totalMonthsPeriod = request.interestPeriod[index].period * 12
        const totalInterestPeriod: number = initialLoanBalance * (request.interestPeriod[0].interestRate / 100) * (totalMonths / 12)
        const totalPaymentPeriod: number = initialLoanBalance + totalInterestPeriod
        const monthlyInterest: number = totalInterestPeriod / totalMonths
        const monthlyPayment: number = totalPaymentPeriod / totalMonths
        const monthlyRepayment: number = initialLoanBalance / totalMonths

        for (let index = 0; index < totalMonthsPeriod; index++) {
            const periodDate = DateUtils.addMonth(request.startDate, index + indexOffset)
            const finalLoanBalance = (initialLoanBalance - monthlyRepayment) < 0 ? 0 : initialLoanBalance - monthlyRepayment
            const paymentSchedule = new PaymentSchedule(indexOffset + index + 1, periodDate, initialLoanBalance, monthlyPayment, monthlyInterest, monthlyRepayment, finalLoanBalance)
            paymentSchedules[indexOffset + index] = paymentSchedule
            initialLoanBalance = finalLoanBalance
            totalPaidInterest += monthlyInterest
            totalPaid += monthlyPayment
        }

        totalMonths -= totalMonthsPeriod
        indexOffset += totalMonthsPeriod
    }

    return new PaymentDetails(paymentSchedules, request.principal, totalPaidInterest, totalPaid)
}

function generateAmortizationTableWithEffectiveInterestRate(request: LoanRequest): PaymentDetails {
    const totalMonths = request.calculateTotalMonths()
    const monthlyRepayment = request.principal / totalMonths

    let totalPaidInterest = 0

    let indexOffset = 0

    let initialLoanBalance = request.principal

    const paymentSchedules = new Array(totalMonths)

    for (let index = 0; index < request.interestPeriod.length; index++) {
        const totalMonthsPeriod = request.interestPeriod[index].period * 12
        const monthlyInterestRate = request.interestPeriod[index].interestRate / 12 / 100

        for (let index = 0; index < totalMonthsPeriod; index++) {
            const periodDate = DateUtils.addMonth(request.startDate, index + indexOffset)
            const monthlyInterest = initialLoanBalance * monthlyInterestRate
            const monthlyPayment = monthlyRepayment + monthlyInterest
            const finalLoanBalance = (initialLoanBalance - monthlyRepayment) < 0 ? 0 : initialLoanBalance - monthlyRepayment
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

function generateAmortizationTableWithAnnuityInterestRate(request: LoanRequest): PaymentDetails {
    function calculateMonthlyPayment(principal: number, monthlyInterestRate: number, totalMonths: number) {
        const numerator = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)
        const denominator = Math.pow(1 + monthlyInterestRate, totalMonths) - 1
        return numerator / denominator
    }

    let initialLoanBalance = request.principal
    let indexOffset = 0
    let totalMonths = request.calculateTotalMonths()
    let totalPaidInterest = 0

    const paymentSchedules = new Array(totalMonths)

    for (let index = 0; index < request.interestPeriod.length; index++) {
        const totalMonthsPeriod = request.interestPeriod[index].period * 12
        const monthlyInterestRate = request.interestPeriod[index].interestRate / 12 / 100
        const monthlyPayment = calculateMonthlyPayment(initialLoanBalance, monthlyInterestRate, totalMonths)

        for (let index = 0; index < totalMonthsPeriod; index++) {
            const periodDate = DateUtils.addMonth(request.startDate, index + indexOffset)
            const monthlyInterest = initialLoanBalance * monthlyInterestRate
            const monthlyRepayment = monthlyPayment - monthlyInterest
            const finalLoanBalance = (initialLoanBalance - monthlyRepayment) < 0 ? 0 : initialLoanBalance - monthlyRepayment
            const paymentSchedule = new PaymentSchedule(index + indexOffset + 1, periodDate, initialLoanBalance, monthlyPayment, monthlyInterest, monthlyRepayment, finalLoanBalance)
            paymentSchedules[index + indexOffset] = paymentSchedule

            initialLoanBalance = finalLoanBalance
            totalPaidInterest += monthlyInterest
        }

        indexOffset += totalMonthsPeriod
        totalMonths -= totalMonthsPeriod
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
        case InterestType.ANNUITY:
            return generateAmortizationTableWithAnnuityInterestRate(loanRequest)
        default:
            return new PaymentDetails()
    }
}