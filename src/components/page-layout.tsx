import { cn } from "@/lib/utils";
import PageHeader from "./page-header";

interface PropsType {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  showHeader?: boolean;
  addMarginTop?: boolean;
}

const PageLayout = ({
  children,
  className,
  title,
  subtitle,
  rightAction,
  showHeader = true,
  addMarginTop = false,
}: PropsType) => {
  return (
    <main className="w-full min-w-0">
      {showHeader && (
        <PageHeader
          title={title}
          subtitle={subtitle}
          rightAction={rightAction}
        />
      )}

      <div
        className={cn(
          "w-full min-w-0 px-4 pb-6 pt-4 sm:px-5 lg:px-6",
          addMarginTop && "-mt-20",
          className
        )}
      >
        {children}
      </div>
    </main>
  );
};

export default PageLayout;