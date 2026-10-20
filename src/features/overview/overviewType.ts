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
/** Ordering OrderStatus (responses send the number). */
export const ORDER_STATUS: Record<number, string> = {
  0: "Pending",
  1: "InventoryReserved",
  2: "AwaitingConfirmation",
  3: "AwaitingPayment",
  4: "PaymentFailed",
  5: "Paid",
  6: "Processing",
  7: "Shipped",
  8: "Delivered",
  9: "ReadyForPickup",
  10: "Collected",
  99: "Cancelled",
};

/** Ordering PaymentState. */
export const PAYMENT_STATE: Record<number, string> = {
  0: "Not started",
  1: "Initiating",
  2: "Awaiting callback",
  3: "Paid",
  4: "Failed",
};

/** Shared PaymentMethod. */
export const PAYMENT_METHOD: Record<number, string> = {
  1: "M-Pesa",
  2: "Card",
  3: "Paybill",
  4: "Cash on delivery",
};

export interface OrderAddress {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  addressLine: string;
  county: string;
  city: string;
  postalCode?: string | null;
  landmark?: string | null;
  country?: string | null;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  customerId: string;
  totalAmount: number;
  status: number;
  requiresPrescriptionApproval: boolean;
  shippingAddress?: OrderAddress | null;
  billingAddress?: OrderAddress | null;
  payment: {
    method: number;
    phoneNumber?: string | null;
    transactionReference?: string | null;
  };
  shipping?: {
    trackingId?: string | null;
    carrierName?: string | null;
    shippedAtUtc?: string | null;
    deliveredAtUtc?: string | null;
  } | null;
  items: {
    orderId: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  createdAt?: string | null;
  paymentState: number;
}
