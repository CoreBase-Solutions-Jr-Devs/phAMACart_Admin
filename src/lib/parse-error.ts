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
  // Simple JS error
  if (err?.message && typeof err.message === "string" && !err.data) {
    return err.message;
  }

  // Plain string body (e.g. "Brand image file is required")
  if (typeof err?.data === "string" && err.data.length > 0) {
    return err.data;
  }

  const data = err?.data;
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

  // FluentValidation (ASP.NET)
  if (
    Array.isArray(data.ValidationErrors) &&
    data.ValidationErrors.length > 0
  ) {
    return (data.ValidationErrors as ValidationError[])
      .map((e) => e.errorMessage)
      .join(", ");
  }

  // ASP.NET ModelState
  if (data.errors && typeof data.errors === "object") {
    const messages = (Object.values(data.errors) as string[][])
      .flat()
      .filter(Boolean);

    if (messages.length > 0) return messages.join(", ");
  }

  // ProblemDetails — prefer detail, fall back to title
  const detail = data.detail ?? data.Detail;
  const title = data.title ?? data.Title;
  const message = data.message ?? data.Message;

  const bodyMessage = detail ?? message ?? title;

  if (bodyMessage) {
    // Prepend status code for 4xx/5xx so the user sees context
    if (typeof status === "number" && HTTP_STATUS_MESSAGES[status]) {
      return `(${status}) ${bodyMessage}`;
    }
    return bodyMessage;
  }

  // Final fallback with friendly label if status is known
  if (typeof status === "number" && HTTP_STATUS_MESSAGES[status]) {
    return `(${status}) ${HTTP_STATUS_MESSAGES[status]}`;
  }

  return `Request failed with status ${status ?? "unknown"}.`;
};