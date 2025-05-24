import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  initialPage?: number;
  initialItemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  currentItems: T[];
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
}

export function usePagination<T>({
  items,
  initialPage = 1,
  initialItemsPerPage = 10,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Reset to first page when items change
  useMemo(() => {
    setCurrentPage(1);
  }, [items]);

  // Reset to first page when items per page changes
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ensure current page is valid
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }

  // Get current items
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = items.slice(startIndex, endIndex);

  return {
    currentPage: validCurrentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    currentItems,
    setCurrentPage,
    setItemsPerPage: handleItemsPerPageChange,
  };
} 