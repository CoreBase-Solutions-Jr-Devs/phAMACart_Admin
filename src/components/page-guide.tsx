"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbulb, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type GuideTip = {
  title: string;
  description: string;
};

export type PageGuideContent = {
  /** Small pill shown before the eyebrow, e.g. "1/3". Omit for non-wizard pages. */
  badge?: string;
  /** Uppercase label, e.g. "PRODUCTS GUIDE" or "STEP 1 GUIDE". */
  eyebrow: string;
  title: string;
  subtitle: string;
  tips: GuideTip[];
};

type PageGuideProps = PageGuideContent & {
  className?: string;
  /** Whether the panel starts open. Defaults to false — it's a floating trigger by default. */
  defaultOpen?: boolean;
};

/**
 * Floating help widget. Renders a round trigger button fixed to the
 * viewport; clicking it pops the guide open as a card that overlays the
 * page instead of taking up layout width. Closes on outside click,
 * Escape, the X button, or re-clicking the trigger.
 *
 * Drop it anywhere in the page tree — position is independent of layout:
 *
 * <PageLayout title="Products" ...>
 *   <ProductsTable />
 *   <PageGuide {...productsPageGuide} />
 * </PageLayout>
 */
export function PageGuide({
  badge,
  eyebrow,
  title,
  subtitle,
  tips,
  className,
  defaultOpen = false,
}: PageGuideProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105",
          className
        )}
        aria-label={open ? "Close guide" : "Open guide"}
        title={open ? "Close guide" : "Open guide"}
      >
        <Lightbulb className="size-5" />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-2xl animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="relative bg-primary text-primary-foreground p-5 space-y-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 rounded-md p-1 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 transition-colors"
              aria-label="Close guide"
              title="Close guide"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2 pr-6">
              {badge && (
                <span className="bg-white/20 text-xs font-semibold px-2 py-1 rounded">
                  {badge}
                </span>
              )}
              <span className="text-xs font-semibold tracking-wide uppercase text-primary-foreground/80">
                {eyebrow}
              </span>
            </div>
            <h3 className="text-lg font-bold leading-snug pr-6">{title}</h3>
            <p className="text-sm text-primary-foreground/90">{subtitle}</p>
          </div>

          <div className="divide-y divide-border max-h-[55vh] overflow-y-auto">
            {tips.map((tip, i) => (
              <div key={i} className="p-4 flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-sm bg-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {tip.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default PageGuide;