import { HeaderGroup, flexRender } from '@tanstack/react-table';

interface Props<T> {
  headerGroups: HeaderGroup<T>[];
}

function TableHeader<T>({ headerGroups }: Props<T>) {
  return (
    <thead>
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

export default TableHeader;
