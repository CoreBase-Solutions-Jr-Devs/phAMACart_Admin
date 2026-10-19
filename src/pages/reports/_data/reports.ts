import { Report } from "@/features/reports/reportsType";

export const reportsData: Report[] = [
  // ============================================================
  // FINANCIAL
  // ============================================================

  {
    id: "sales-report",
    title: "Sales Report",
    category: "Financial",
    description:
      "Summary of sales across orders, products, customers, payment methods, and reporting periods.",
    cadence: "Updated daily",
    icon: "CreditCard",
    available: false,
  },

  {
    id: "transactions",
    title: "Transactions",
    category: "Financial",
    description:
      "Detailed financial transactions including invoices, payments, refunds, payment methods, and transaction status.",
    cadence: "Updated daily",
    icon: "FileText",
    available: false,
  },

  {
    id: "payment-report",
    title: "Payment Report",
    category: "Financial",
    description:
      "Payment activity across orders showing payment methods, amounts, successful payments, failed payments, and outstanding balances.",
    cadence: "Updated daily",
    icon: "CreditCard",
    available: false,
  },

  {
    id: "profit-loss",
    title: "Profit & Loss",
    category: "Financial",
    description:
      "Financial performance showing sales revenue, costs, expenses, gross profit, and net profitability over a selected period.",
    cadence: "Monthly",
    icon: "PieChart",
    available: false,
  },

  {
    id: "revenue-summary",
    title: "Revenue Summary",
    category: "Financial",
    description:
      "Aggregated revenue by date, product category, payment method, and sales channel with period-over-period comparisons.",
    cadence: "Updated daily",
    icon: "PieChart",
    available: false,
  },

  {
    id: "refund-report",
    title: "Refund Report",
    category: "Financial",
    description:
      "Overview of refunded orders and transactions including refund amounts, reasons, dates, and payment methods.",
    cadence: "Updated daily",
    icon: "FileText",
    available: false,
  },

  {
    id: "tax-report",
    title: "Tax Report",
    category: "Financial",
    description:
      "Taxable sales and tax amounts summarized by product, transaction, and reporting period.",
    cadence: "Monthly",
    icon: "FileText",
    available: false,
  },

  // ============================================================
  // INVENTORY
  // ============================================================

  {
    id: "inventory-report",
    title: "Inventory Report",
    category: "Inventory",
    description:
      "Current inventory position showing products, available stock, reserved stock, reorder levels, and stock value.",
    cadence: "Real-time",
    icon: "ClipboardList",
    available: false,
  },

  {
    id: "stock-movement",
    title: "Stock Movement",
    category: "Inventory",
    description:
      "Tracks inventory movements including stock received, sold, adjusted, transferred, and reserved quantities.",
    cadence: "Updated daily",
    icon: "ClipboardList",
    available: false,
  },

  {
    id: "low-stock-report",
    title: "Low Stock Report",
    category: "Inventory",
    description:
      "Products approaching or below their configured reorder levels to support timely replenishment.",
    cadence: "Real-time",
    icon: "Clock",
    available: false,
  },

  {
    id: "product-performance",
    title: "Product Performance",
    category: "Inventory",
    description:
      "Product-level performance showing units sold, revenue generated, stock movement, and contribution to overall sales.",
    cadence: "Updated daily",
    icon: "PieChart",
    available: false,
  },

  {
    id: "expired-products",
    title: "Expired Products",
    category: "Inventory",
    description:
      "Products approaching or exceeding their expiry dates to support inventory control and pharmacy compliance.",
    cadence: "Real-time",
    icon: "Clock",
    available: false,
  },

  // ============================================================
  // CUSTOMERS
  // ============================================================

  {
    id: "customer-sales",
    title: "Customer Sales",
    category: "Customers",
    description:
      "Customer purchasing activity showing order history, total spend, average order value, and purchase frequency.",
    cadence: "Updated daily",
    icon: "CreditCard",
    available: false,
  },

  {
    id: "customer-report",
    title: "Customer Report",
    category: "Customers",
    description:
      "Customer overview including account activity, orders, payments, prescriptions, and purchasing history.",
    cadence: "Updated daily",
    icon: "ClipboardList",
    available: false,
  },

  {
    id: "customer-orders",
    title: "Customer Orders",
    category: "Customers",
    description:
      "Order activity by customer including order count, order value, status, payment status, and delivery status.",
    cadence: "Updated daily",
    icon: "FileText",
    available: false,
  },

  // ============================================================
  // ORDERS / CHECKOUT
  // ============================================================

  {
    id: "orders-report",
    title: "Orders Report",
    category: "Orders",
    description:
      "Comprehensive order report showing orders, order values, customers, payment status, fulfillment status, and delivery status.",
    cadence: "Updated daily",
    icon: "ClipboardList",
    available: false,
  },

  {
    id: "order-status-report",
    title: "Order Status",
    category: "Orders",
    description:
      "Order pipeline showing pending, confirmed, processing, dispatched, delivered, cancelled, and completed orders.",
    cadence: "Real-time",
    icon: "Clock",
    available: false,
  },

  {
    id: "basket-checkout-report",
    title: "Checkout Report",
    category: "Orders",
    description:
      "Checkout activity showing completed, abandoned, cancelled, and failed checkout sessions.",
    cadence: "Updated daily",
    icon: "CreditCard",
    available: false,
  },

  // ============================================================
  // OPERATIONS
  // ============================================================

  {
    id: "prescription-report",
    title: "Prescription Report",
    category: "Operations",
    description:
      "Prescription activity including submitted, reviewed, approved, rejected, and fulfilled prescriptions.",
    cadence: "Updated daily",
    icon: "FileText",
    available: false,
  },

  {
    id: "prescription-status",
    title: "Prescription Status",
    category: "Operations",
    description:
      "Tracks prescription workflow from submission and review through approval, dispensing, and order fulfillment.",
    cadence: "Real-time",
    icon: "ClipboardList",
    available: false,
  },

  {
    id: "delivery-report",
    title: "Delivery Report",
    category: "Operations",
    description:
      "Delivery performance showing dispatched orders, completed deliveries, failed deliveries, delivery times, and delivery status.",
    cadence: "Updated daily",
    icon: "Building2",
    available: false,
  },

  {
    id: "delivery-performance",
    title: "Delivery Performance",
    category: "Operations",
    description:
      "Delivery performance analysis including fulfillment time, delivery completion rate, failed deliveries, and turnaround time.",
    cadence: "Updated daily",
    icon: "Clock",
    available: false,
  },
];