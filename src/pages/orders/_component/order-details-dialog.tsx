import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetOrderByIdQuery } from "@/features/overview/overviewAPI";
import {
  PAYMENT_METHOD,
  PAYMENT_STATE,
  type OrderAddress,
} from "@/features/overview/overviewType";
import { formatDateTime, formatKES } from "@/lib/format-display";
import { parseError } from "@/lib/parse-error";
import { OrderStatusBadge } from "./order-status-badge";

const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="min-w-0">
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="mt-0.5 truncate text-sm font-medium">{value || "—"}</div>
  </div>
);

const AddressBlock = ({ title, address }: { title: string; address?: OrderAddress | null }) => (
  <div className="space-y-1 text-sm">
    <p className="text-xs font-medium text-muted-foreground">{title}</p>
    {address ? (
      <>
        <p className="font-medium">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.addressLine}</p>
        {address.landmark && <p className="text-muted-foreground">{address.landmark}</p>}
        <p className="text-muted-foreground">
          {[address.city, address.county, address.postalCode].filter(Boolean).join(", ")}
        </p>
        <p className="text-muted-foreground">
          {address.phoneNumber} · {address.emailAddress}
        </p>
      </>
    ) : (
      <p className="text-muted-foreground">Store pickup — no delivery address</p>
    )}
  </div>
);

interface Props {
  orderId: string | null;
  onOpenChange: (open: boolean) => void;
}

export const OrderDetailsDialog = ({ orderId, onOpenChange }: Props) => {
  const { data: order, isFetching, isError, error } = useGetOrderByIdQuery(orderId ?? "", {
    skip: !orderId,
  });

  return (
    <Dialog open={!!orderId} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-3">
            {order ? `Order ${order.orderNumber}` : "Order"}
            {order && <OrderStatusBadge status={order.status} />}
          </DialogTitle>
          <DialogDescription>
            {order ? `Placed ${formatDateTime(order.createdAt)}` : "Loading order…"}
          </DialogDescription>
        </DialogHeader>

        {isError ? (
          <p className="py-6 text-center text-sm text-destructive">{parseError(error)}</p>
        ) : isFetching || !order ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Field label="Total" value={formatKES(order.totalAmount)} />
              <Field label="Payment method" value={PAYMENT_METHOD[order.payment?.method] ?? "—"} />
              <Field label="Payment" value={PAYMENT_STATE[order.paymentState] ?? "—"} />
              <Field label="M-Pesa / reference" value={order.payment?.transactionReference} />
            </div>

            {order.requiresPrescriptionApproval && (
              <p className="rounded-md bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                Contains prescription items — a pharmacist approves them under Prescriptions.
              </p>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit price</TableHead>
                  <TableHead className="text-right">Line total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatKES(item.price)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatKES(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Order total (incl. delivery & VAT)</TableCell>
                  <TableCell className="text-right tabular-nums">{formatKES(order.totalAmount)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            <Separator />

            <div className="grid gap-5 sm:grid-cols-2">
              <AddressBlock title="Delivery address" address={order.shippingAddress} />
              <AddressBlock title="Billing" address={order.billingAddress} />
            </div>

            {(order.shipping?.carrierName || order.shipping?.trackingId) && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Field label="Carrier" value={order.shipping?.carrierName} />
                <Field label="Tracking" value={order.shipping?.trackingId} />
                <Field label="Shipped" value={formatDateTime(order.shipping?.shippedAtUtc)} />
                <Field label="Delivered" value={formatDateTime(order.shipping?.deliveredAtUtc)} />
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
