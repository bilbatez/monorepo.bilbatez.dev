import { RowModel, flexRender } from "@tanstack/react-table";

interface Props<T> {
  rowModel: RowModel<T>;
}

function TableBody<T>({ rowModel }: Props<T>) {
  return (
    <tbody>
      {rowModel.rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;
