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
            this.startDate = data["startDate"]
            this.principal = parseFloat(data["principal"])
            const interestPeriodMaxLength = new Set([
                InterestType.FLAT,
                InterestType.ANNUITY,
            ]).has(interestType) ? 1 : data["interest"].length

            this.interestPeriod = new Array(interestPeriodMaxLength)
            for (let index = 0; index < interestPeriodMaxLength; index++) {
                this.interestPeriod[index] = new InterestPeriod(data["interest"][index], data["period"][index])
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
        if (period && date && initialLoanBalance && payment && interest && repayment && finalLoanBalance) {
            this.period = period
            this.date = date
            this.initialLoanBalance = initialLoanBalance
            this.payment = payment
            this.interest = interest
            this.repayment = repayment
            this.finalLoanBalance = finalLoanBalance
        }
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
        if (paymentSchedules && totalPrincipal && totalPaidInterest && totalPaid) {
            this.paymentSchedules = paymentSchedules
            this.totalPrincipal = totalPrincipal
            this.totalPaidInterest = totalPaidInterest
            this.totalPaid = totalPaid
        }
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