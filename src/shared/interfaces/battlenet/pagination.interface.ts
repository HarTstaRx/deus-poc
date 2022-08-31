export interface PaginationInterface<T> {
  page: number;
  pageSize: number;
  maxPageSize: number;
  pageCount: number;
  results: {
    key: string;
    data: T;
  }[];
}
