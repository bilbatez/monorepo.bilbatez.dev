import { CurrencyUtils, DateUtils } from "@/app/_utils";
import { PaymentDetails, PaymentSchedule } from "@/types/formula";
import { createColumnHelper, getCoreRowModel } from "@tanstack/react-table";
import { memo } from "react";
import Table from "./Table";

const columnHelper = createColumnHelper<PaymentSchedule>()
const columns = [
    columnHelper.accessor("period", {
        header: "Cicilan Ke"
    }),
    columnHelper.accessor("date", {
        header: "Tanggal",
        cell: props => DateUtils.format(props.getValue())
    }),
    columnHelper.accessor("payment", {
        header: "Pembayaran",
        cell: props => CurrencyUtils.format(props.getValue()),
    }),
    columnHelper.accessor("repayment", {
        header: "Pengurangan Pokok Pinjaman",
        cell: props => CurrencyUtils.format(props.getValue()),
    }),
    columnHelper.accessor("interest", {
        header: "Pembayaran Bunga",
        cell: props => CurrencyUtils.format(props.getValue()),
    }),
    columnHelper.accessor("initialLoanBalance", {
        header: "Saldo Awal",
        cell: props => CurrencyUtils.format(props.getValue()),
    }),
    columnHelper.accessor("finalLoanBalance", {
        header: "Saldo Akhir",
        cell: props => CurrencyUtils.format(props.getValue()),
    })
]

interface Props {
    paymentDetails: PaymentDetails
}

function AmortizationScheduleTable({ paymentDetails }: Props) {
    return (
        <Table<PaymentSchedule> tableOptions={{
            data: paymentDetails.paymentSchedules,
            columns: columns,
            getCoreRowModel: getCoreRowModel(),
        }} />
    )
}

export default memo(AmortizationScheduleTable)