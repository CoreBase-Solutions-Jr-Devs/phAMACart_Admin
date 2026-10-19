export interface ValidationError {
  propertyName: string;
  errorMessage: string;
}

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: "Bad request.",
  401: "Unauthorized. Please log in and try again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  405: "Method not allowed.",
  408: "The request timed out. Please try again.",
  409: "Conflict. The resource may already exist.",
  410: "The resource is no longer available.",
  422: "Unprocessable request. Please check your input.",
  429: "Too many requests. Please slow down and try again.",
  500: "Internal server error. Please try again later.",
  502: "Bad gateway. The server is temporarily unavailable.",
  503: "Service unavailable. Please try again later.",
  504: "Gateway timeout. Please try again later.",
};

export const parseError = (err: any): string => {
  // 1. Standard JavaScript error instance (e.g. throw new Error("..."))
  if (err?.message && typeof err.message === "string" && !err.data) {
    return err.message;
  }

  // 2. Plain string error body
  if (typeof err?.data === "string" && err.data.length > 0) {
    return err.data;
  }

  const data = err?.data ?? err;
  const status = err?.status;

  if (!data) {
    if (status === "FETCH_ERROR") {
      return "Network error. Please check your connection.";
    }
    if (typeof status === "number" && HTTP_STATUS_MESSAGES[status]) {
      return `(${status}) ${HTTP_STATUS_MESSAGES[status]}`;
    }
    return `Request failed (${status ?? "unknown"}).`;
  }

  // 3. Result Pattern / Domain Failure payload: { isFailure: true, error: { message: "..." } }
  if (data?.error?.message && typeof data.error.message === "string") {
    return data.error.message;
  }

  // 4. Custom FluentValidation Array: { ValidationErrors: [{ errorMessage: "..." }] }
  if (
    Array.isArray(data.ValidationErrors) &&
    data.ValidationErrors.length > 0
  ) {
    return (data.ValidationErrors as ValidationError[])
      .map((e) => e.errorMessage)
      .join(", ");
  }

  // 5. ASP.NET ModelState / FluentValidation Dictionary: { errors: { FieldName: ["Error 1"] } }
  if (data.errors && typeof data.errors === "object") {
    const messages = (Object.values(data.errors) as (string | string[])[])
      .flat()
      .map(String)
      .filter(Boolean);

    if (messages.length > 0) return messages.join(", ");
  }

  // 6. ProblemDetails fields (detail, message, title)
  const detail = data.detail ?? data.Detail;
  const message = data.message ?? data.Message;
  const title = data.title ?? data.Title;

  const bodyMessage =
    detail ??
    message ??
    (title !== "One or more validation errors occurred." ? title : null);

  if (bodyMessage && typeof bodyMessage === "string") {
    return bodyMessage;
  }

  // 7. Fallback to HTTP Status Code description
  if (typeof status === "number" && HTTP_STATUS_MESSAGES[status]) {
    return `(${status}) ${HTTP_STATUS_MESSAGES[status]}`;
  }

  return `Request failed with status ${status ?? "unknown"}.`;
};