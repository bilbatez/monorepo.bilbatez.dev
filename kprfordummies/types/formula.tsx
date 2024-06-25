import { InterestType } from "./interest"

export class InterestPeriod {
    readonly interestRate!: number
    readonly period!: number
}

export class LoanRequest {
    readonly startDate!: Date
    readonly principal!: number
    readonly interestPeriod!: InterestPeriod[]
}

export class PaymentSchedule {
    readonly period!: number
    readonly initialLoanBalance!: number
    readonly payment!: number
    readonly interest!: number
    readonly principal!: number
    readonly finalLoanBalance!: number
}

export class PaymentDetails {
    readonly paymentSchedule!: PaymentSchedule[]
    readonly totalPaidInterest!: number
    readonly totalPaid!: number
}

export interface FormulaFunc {
    (request: LoanRequest): PaymentDetails
}

export type AvailableFormula = {
    [key in InterestType]: {
        display: string,
        formulaFunc: FormulaFunc
    }
}