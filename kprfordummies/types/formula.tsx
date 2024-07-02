import { FieldValues } from "react-hook-form"
import { InterestType } from "./interest"

export class InterestPeriod {
    readonly interestRate!: number
    readonly period!: number

    constructor();
    constructor(interestRate: number, period: number);

    constructor(interestRate?: any, period?: any) {
        if (interestRate && period) {
            this.interestRate = parseFloat(interestRate)
            this.period = parseInt(period)
        }
    }
}

export class LoanRequest {
    readonly startDate!: Date
    readonly principal!: number
    readonly interestPeriod!: InterestPeriod[]

    constructor()
    constructor(data: FieldValues, interestType: InterestType)

    constructor(data?: FieldValues, interestType?: InterestType) {
        if (data && interestType) {
            this.startDate = data.startDate
            this.principal = parseFloat(data.principal)

            this.interestPeriod = new Array(data.interestPeriod.length)
            for (let index = 0; index < data.interestPeriod.length; index++) {
                this.interestPeriod[index] = new InterestPeriod(data.interestPeriod[index].interest, data.interestPeriod[index].period)
            }
        }
    }

    calculateTotalMonths(): number {
        return this.interestPeriod
            .map(interestPeriod => interestPeriod.period)
            .reduce((accumulator: number, currentValue: number) => accumulator + currentValue) * 12
    }
}

export class PaymentSchedule {
    readonly period!: number
    readonly date!: Date
    readonly initialLoanBalance!: number
    readonly payment!: number
    readonly interest!: number
    readonly repayment!: number
    readonly finalLoanBalance!: number

    constructor()
    constructor(period: number, date: Date, initialLoanBalance: number, payment: number, interest: number, repayment: number, finalLoanBalance: number)

    constructor(period?: number, date?: Date, initialLoanBalance?: number, payment?: number, interest?: number, repayment?: number, finalLoanBalance?: number) {
        this.period = period ?? 0
        this.date = date ?? new Date()
        this.initialLoanBalance = initialLoanBalance ?? 0
        this.payment = payment ?? 0
        this.interest = interest ?? 0
        this.repayment = repayment ?? 0
        this.finalLoanBalance = finalLoanBalance ?? 0
    }
}

export class PaymentDetails {
    readonly paymentSchedules!: PaymentSchedule[]
    readonly totalPrincipal!: number
    readonly totalPaidInterest!: number
    readonly totalPaid!: number

    constructor()
    constructor(paymentSchedules: PaymentSchedule[], totalPrincipal: number, totalPaidInterest: number, totalPaid: number)

    constructor(paymentSchedules?: PaymentSchedule[], totalPrincipal?: number, totalPaidInterest?: number, totalPaid?: number) {
        this.paymentSchedules = paymentSchedules ?? []
        this.totalPrincipal = totalPrincipal ?? 0
        this.totalPaidInterest = totalPaidInterest ?? 0
        this.totalPaid = totalPaid ?? 0
    }
}

export interface FormulaFunc {
    (request: LoanRequest): PaymentDetails | undefined
}

export type AvailableFormula = {
    [key in InterestType]: {
        display: string,
        formulaFunc: FormulaFunc
    }
}