import React from 'react';
import { usePagination } from '../../hooks/usePagination';
import Pagination from './Pagination';

interface Column<T> {
  key: string;
  title: string;
  width?: string;
  render?: (value: any, record: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  initialPage?: number;
  initialItemsPerPage?: number;
}

function Table<T extends { id?: number | string }>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data found',
  initialPage = 1,
  initialItemsPerPage = 10,
}: TableProps<T>) {
  const {
    currentItems,
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({
    items: data,
    initialPage,
    initialItemsPerPage,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const getValue = (item: T, key: string) => {
    return key.split('.').reduce((obj: any, key) => obj?.[key], item);
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item, rowIndex) => (
              <tr key={item.id || rowIndex}>
                {columns.map((column, colIndex) => (
                  <td
                    key={`${rowIndex}-${column.key}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {column.render
                      ? column.render(getValue(item, column.key), item)
                      : getValue(item, column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}

export default Table;