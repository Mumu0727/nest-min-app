// common/interfaces/pagination-results.interface.ts
export interface PaginationResults<T> {
  records: T[];
  count: number; // Total items
  totalPages: number;
  page: number;
  limit: number;
}
