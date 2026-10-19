import { Link } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>

        {/* Error Code */}
        <p className="text-sm font-medium tracking-widest text-muted-foreground">
          ERROR 404
        </p>

        {/* Heading */}
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Page not found
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
          The page you're looking for doesn't exist, has been moved, or you
          don't have access to it.
        </p>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>

          <Link
            to="/"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
