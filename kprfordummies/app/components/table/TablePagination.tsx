import { Table } from "@tanstack/react-table"

interface Props<T> {
    table: Table<T>
}

function TablePagination<T>({ table }: Props<T>) {
    return (
        <div className="flex flex-wrap items-center gap-2 my-3 justify-end">
            <div className="max-lg:mb-3">
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
            </div>

            <div className="flex flex-wrap items-center justify-end">
                <div className="flex items-center gap-1 max-lg:mb-3">
                    <div>Halaman</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} dari{' '}
                        {table.getPageCount().toLocaleString()}
                    </strong>
                </div>
                <div className="mx-3 max-lg:mb-3">|</div>
                <div className="flex items-center gap-1 max-lg:mb-3">
                    Pergi ke Halaman:
                    <input
                        className="pagination-input"
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                    />
                </div>
                <select
                    className="pagination-max-item-selection max-lg:mb-3"
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[36, 60, 120].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Tunjukan {pageSize} baris
                        </option>
                    ))}
                </select>
            </div>

        </div>
    )
}

export default TablePagination