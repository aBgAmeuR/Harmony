/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  totalItems: number;
  itemsPerPage?: number;
}

interface UsePaginationResult {
  currentPage: number;
  currentIndex: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  paginatedItems: <T>(items: T[]) => T[];
}

export function usePagination<T>({
  initialPage = 0,
  totalItems,
  itemsPerPage = 1,
}: UsePaginationOptions): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages =
    itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;
  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  // Helper function to get paginated items from an array
  const paginatedItems = <T>(items: T[]): T[] => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  return {
    currentPage,
    currentIndex: currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    paginatedItems,
  };
}
