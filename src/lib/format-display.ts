/** Shared display formatting for KES amounts, dates and report cells. */

export const formatKES = (value: number | null | undefined) => {
  if (value == null || Number.isNaN(value)) return "—";
  const n = Number(value);
  const decimals = Number.isInteger(n) ? 0 : 2;
  return `KES ${n.toLocaleString("en-KE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

/** Short form for tight spaces: KES 102.6K, KES 1.2M. */
export const formatKESCompact = (value: number | null | undefined) =>
  value == null || Number.isNaN(value)
    ? "—"
    : `KES ${Number(value).toLocaleString("en-KE", {
        notation: "compact",
        maximumFractionDigits: 1,
      })}`;

export const formatNumber = (value: number | null | undefined) =>
  value == null || Number.isNaN(value)
    ? "—"
    : Number(value).toLocaleString("en-KE", { maximumFractionDigits: 2 });

export const formatDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

export const formatDateTime = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/** "AwaitingPayment" -> "Awaiting payment" */
export const humanize = (value: string | null | undefined) =>
  value
    ? value
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (c) => c.toUpperCase())
        .replace(/ ([A-Z])(?=[a-z])/g, (_, c: string) => ` ${c.toLowerCase()}`)
    : "—";

/** yyyy-MM-dd for <input type="date"> in local time. */
export const toDateInput = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};
