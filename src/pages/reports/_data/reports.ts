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
    available: true,
    href: "/reports/sales-report",
  },

  {
    id: "transactions",
    title: "Transactions",
    category: "Financial",
    description:
      "Every M-Pesa payment attempt with amount, M-Pesa receipt, result and anything that needs finance review.",
    cadence: "Updated daily",
    icon: "FileText",
    available: true,
    href: "/reports/transactions",
  },

  {
    id: "payment-report",
    title: "Payment Report",
    category: "Financial",
    description:
      "Payment activity across orders showing payment methods, amounts, successful payments, failed payments, and outstanding balances.",
    cadence: "Updated daily",
    icon: "CreditCard",
    available: true,
    href: "/reports/payment-report",
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
    available: true,
    href: "/reports/revenue-summary",
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
    available: true,
    href: "/reports/tax-report",
  },

  // ============================================================
  // INVENTORY
  // ============================================================

  {
    id: "inventory-report",
    title: "Inventory Report",
    category: "Inventory",
    description:
      "Current stock per product: on hand, reserved, available and stock value at selling price.",
    cadence: "Real-time",
    icon: "ClipboardList",
    available: true,
    href: "/reports/inventory-report",
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
    available: true,
    href: "/reports/low-stock",
  },

  {
    id: "product-performance",
    title: "Product Performance",
    category: "Inventory",
    description:
      "Product-level performance showing units sold, revenue generated, stock movement, and contribution to overall sales.",
    cadence: "Updated daily",
    icon: "PieChart",
    available: true,
    href: "/reports/product-performance",
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
    available: true,
    href: "/reports/customer-sales",
  },

  {
    id: "customer-report",
    title: "Customer Report",
    category: "Customers",
    description:
      "Customers who registered in the period: contact details, email confirmation, phAMACore sync and last sign-in.",
    cadence: "Updated daily",
    icon: "ClipboardList",
    available: true,
    href: "/reports/customer-report",
  },

  {
    id: "customer-orders",
    title: "Customer Orders",
    category: "Customers",
    description:
      "Order activity by customer including order count, order value, status, payment status, and delivery status.",
    cadence: "Updated daily",
    icon: "FileText",
    available: true,
    href: "/reports/customer-orders",
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
    available: true,
    href: "/reports/orders-report",
  },

  {
    id: "order-status-report",
    title: "Order Status",
    category: "Orders",
    description:
      "Order pipeline showing pending, confirmed, processing, dispatched, delivered, cancelled, and completed orders.",
    cadence: "Real-time",
    icon: "Clock",
    available: true,
    href: "/reports/order-status",
  },

  {
    id: "basket-checkout-report",
    title: "Checkout Report",
    category: "Orders",
    description:
      "How far checkouts got — reserved, awaiting payment, paid, fulfilled — with the most common failure reasons.",
    cadence: "Updated daily",
    icon: "CreditCard",
    available: true,
    href: "/reports/checkout-report",
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
    available: true,
    href: "/reports/prescription-report",
  },

  {
    id: "prescription-status",
    title: "Prescription Status",
    category: "Operations",
    description:
      "Tracks prescription workflow from submission and review through approval, dispensing, and order fulfillment.",
    cadence: "Real-time",
    icon: "ClipboardList",
    available: true,
    href: "/reports/prescription-status",
  },

  {
    id: "delivery-report",
    title: "Delivery Report",
    category: "Operations",
    description:
      "Delivery performance showing dispatched orders, completed deliveries, failed deliveries, delivery times, and delivery status.",
    cadence: "Updated daily",
    icon: "Building2",
    available: true,
    href: "/reports/delivery-report",
  },

  {
    id: "delivery-performance",
    title: "Delivery Performance",
    category: "Operations",
    description:
      "Delivery performance analysis including fulfillment time, delivery completion rate, failed deliveries, and turnaround time.",
    cadence: "Updated daily",
    icon: "Clock",
    available: true,
    href: "/reports/delivery-performance",
  },
];