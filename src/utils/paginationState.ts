export default class paginationState {
  get getCurrentPage(): number {
    return this.currentPage;
  }

  set setCurrentPage(value: number) {
    this.currentPage = value;
  }

  get getPageSize(): number {
    return this.pageSize;
  }

  set setPageSize(value: number) {
    this.pageSize = value;
  }

  private currentPage: number = 1;
  private pageSize: number = 20;

  constructor(currentPage?: number, pageSize?: number) {
    this.currentPage = currentPage || 1;
    this.pageSize = pageSize || 20;
  }
}
