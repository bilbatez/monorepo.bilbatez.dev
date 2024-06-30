import { TableOptions, useReactTable } from "@tanstack/react-table"
import TableBody from "./TableBody"
import TableHeader from "./TableHeader"

interface Props<T> {
    tableOptions: TableOptions<T>
}

function Table<T>({ tableOptions }: Props<T>) {
    const table = useReactTable<T>(tableOptions)
    return (
        <table>
            <TableHeader<T> headerGroups={table.getHeaderGroups()} />
            <TableBody<T> rowModel={table.getRowModel()} />
        </table>

    )
}

export default Table