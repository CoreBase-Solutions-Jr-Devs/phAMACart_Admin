import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",

        month: "space-y-4",

        month_caption:
          "flex items-center justify-center relative h-8",

        caption_label:
          "text-sm font-medium",

        dropdowns:
          "flex items-center justify-center gap-1",

        dropdown:
          "rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300",

        nav:
          "absolute inset-x-0 flex items-center justify-between px-1",

        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100"
        ),

        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100"
        ),

        month_grid:
          "w-full border-collapse",

        weekdays:
          "flex",

        weekday:
          "w-9 rounded-md text-center text-[0.8rem] font-normal text-slate-500",

        week:
          "mt-2 flex w-full",

        day:
          "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",

        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),

        selected:
          "bg-slate-900 text-white hover:bg-slate-900 hover:text-white focus:bg-slate-900 focus:text-white",

        today:
          "bg-slate-100 text-slate-900",

        outside:
          "text-slate-400 opacity-50",

        disabled:
          "text-slate-300 opacity-50",

        range_middle:
          "aria-selected:bg-slate-100 aria-selected:text-slate-900",

        range_start:
          "rounded-l-md",

        range_end:
          "rounded-r-md",

        hidden:
          "invisible",

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
