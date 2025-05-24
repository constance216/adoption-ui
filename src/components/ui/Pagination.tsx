import React from 'react';
import { Button } from './';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems,
  onItemsPerPageChange,
}) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;
  const itemsPerPageOptions = [5, 10, 25, 50];

  // Calculate which page numbers to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-4 py-3 border-t border-gray-200">
      <div className="flex items-center text-sm text-gray-700">
        <div className="hidden sm:block">
          Showing{' '}
          <span className="font-medium">{startItem}</span>
          {' to '}
          <span className="font-medium">{endItem}</span>
          {' of '}
          <span className="font-medium">{totalItems}</span>
          {' results'}
        </div>
        {onItemsPerPageChange && (
          <div className="ml-4 flex items-center">
            <span className="mr-2">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="rounded border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
        >
          First
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="hidden sm:flex space-x-1">
          {startPage > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageClick(1)}
              >
                1
              </Button>
              {startPage > 2 && (
                <span className="px-2 py-2 text-gray-500">...</span>
              )}
            </>
          )}

          {pageNumbers.map((number) => (
            <Button
              key={number}
              variant={currentPage === number ? "primary" : "secondary"}
              size="sm"
              onClick={() => handlePageClick(number)}
            >
              {number}
            </Button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-2 py-2 text-gray-500">...</span>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageClick(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </Button>
      </div>
    </div>
  );
};

export default Pagination; 