import { AvailableFormula, LoanRequest, PaymentDetails } from "@/types/formula";
import { InterestType } from "@/types/interest";

export const INTEREST_FORMULAS: AvailableFormula = {
    [InterestType.NONE]: {
        display: '',
        formulaFunc: (request: LoanRequest) => { return new PaymentDetails() }
    },
    [InterestType.FLAT]: {
        display: String.raw`
    \[\text{Bunga Per Bulan} = 
        \frac{\text{Pokok Pinjaman} \times \text{Suku Bunga Per Tahun} \times \text{Jumlah Tahun Jangka Waktu Kredit}}
        {\text{Jumlah Bulan Dalam Jangka Waktu Kredit}}
        \]
    `,
        formulaFunc: (request: LoanRequest) => { return new PaymentDetails() }
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