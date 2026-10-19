export interface OrderAdminDto {
  id: string;
  orderNo: string;
  itemsCount: number;
  totalPrice: number;
  createdAt: string;
  status: string;
  paymentMethod: string;
  deliveredAt?: string | null;
}

export interface PaginatedResult<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export interface GetOrdersResponse {
  orders: PaginatedResult<OrderAdminDto>;
}

export interface OrderQueryParams {
  pageIndex: number;
  pageSize: number;
  desc: boolean;
  search?: string;
  status?: string;
  customerId?: string;
  fromDate?: string;   
  toDate?: string;     
  sortBy?: string;
}