import { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  rightAction?: ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  rightAction,
}: PageHeaderProps) => {
  return (
    <div className="w-full px-5 lg:px-0 dark:text-white">
      <div className="w-full mx-auto">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {(title || subtitle) && (
            <div className="space-y-1">
              {title && (
                <h1 className="text-lg sm:text-2xl font-bold">
                  {title}
                </h1>
              )}

              {subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {rightAction}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;