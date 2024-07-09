import { TableOptions, useReactTable } from "@tanstack/react-table"
import TableBody from "./TableBody"
import TableHeader from "./TableHeader"
import TablePagination from "./TablePagination"

interface Props<T> {
    tableOptions: TableOptions<T>
}

function Table<T>({ tableOptions }: Props<T>) {
    const table = useReactTable<T>(tableOptions)
    return (
        <>
            <div className="relative overflow-x-auto overflow-y-hidden">
                <table>
                    <TableHeader<T> headerGroups={table.getHeaderGroups()} />
                    <TableBody<T> rowModel={table.getRowModel()} />
                </table>
            </div>

            <TablePagination<T> table={table} />
        </>
    )
}

export default Table