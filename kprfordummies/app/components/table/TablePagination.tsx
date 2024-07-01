import { Table } from "@tanstack/react-table"

interface Props<T> {
    table: Table<T>
}

function TablePagination<T>({ table }: Props<T>) {
    return (
        <div className="flex items-center gap-2 mb-3 justify-end">
            <button
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
            >
                {'<<'}
            </button>
            <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                {'<'}
            </button>
            <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                {'>'}
            </button>
            <button
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
            >
                {'>>'}
            </button>
            <span className="flex items-center gap-1">
                <div>Halaman</div>
                <strong>
                    {table.getState().pagination.pageIndex + 1} dari{' '}
                    {table.getPageCount().toLocaleString()}
                </strong>
            </span>
            <span className="flex items-center gap-1">
                | Pergi ke Halaman:
                <input
                    className="pagination-input"
                    type="number"
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        table.setPageIndex(page)
                    }}
                />
            </span>
            <select
                className="pagination-max-item-selection"
                value={table.getState().pagination.pageSize}
                onChange={e => {
                    table.setPageSize(Number(e.target.value))
                }}
            >
                {[30, 60, 120].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                        Tunjukan {pageSize} baris
                    </option>
                ))}
            </select>
        </div>
    )
}

export default TablePagination