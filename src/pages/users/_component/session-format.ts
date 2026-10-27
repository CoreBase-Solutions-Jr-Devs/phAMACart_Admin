/** Short local date-time, or an em dash when missing. */
export const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value.endsWith("Z") || value.includes("+") ? value : `${value}Z`);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** A readable device label from the stored device name or user agent. */
export const describeDevice = (device?: string | null, userAgent?: string | null) => {
  if (device && device.trim()) return device;
  if (!userAgent) return "Unknown device";
  const ua = userAgent;
  const os = /Windows/i.test(ua)
    ? "Windows"
    : /Android/i.test(ua)
      ? "Android"
      : /iPhone|iPad|iOS/i.test(ua)
        ? "iOS"
        : /Mac OS X|Macintosh/i.test(ua)
          ? "macOS"
          : /Linux/i.test(ua)
            ? "Linux"
            : "";
  const browser = /Edg\//i.test(ua)
    ? "Edge"
    : /Chrome\//i.test(ua)
      ? "Chrome"
      : /Firefox\//i.test(ua)
        ? "Firefox"
        : /Safari\//i.test(ua)
          ? "Safari"
          : /okhttp|Dart|Expo|ReactNative/i.test(ua)
            ? "Mobile app"
            : "";
  return [browser, os].filter(Boolean).join(" on ") || "Unknown device";
};
