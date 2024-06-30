import { FieldValues } from "react-hook-form"
import { InterestType } from "./interest"

export class InterestPeriod {
    readonly interestRate!: number
    readonly period!: number

    constructor();
    constructor(interestRate: number, period: number);

    constructor(interestRate?: number, period?: number) {
        if (interestRate && period) {
            this.interestRate = interestRate
            this.period = period
        }
    }
}

export class LoanRequest {
    readonly startDate!: Date
    readonly principal!: number
    readonly interestPeriod!: InterestPeriod[]

    constructor();
    constructor(data: FieldValues);

    constructor(data?: FieldValues) {
        if (data) {
            this.startDate = data["startDate"]
            this.principal = data["principal"]
            for (let index = 0; index < data["interest"].length; index++) {
                this.interestPeriod[index] = new InterestPeriod(data["interest"][index], data["period"][index])
            }
        }
    }
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