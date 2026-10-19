import { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/* ===============================================================
   DatePickerField
   -----------------------------------------------------------------
   A single, reusable date input used everywhere in the prescription
   dialog (DOB, issue date, expiry date). Backed by a calendar popover
   so users pick a date instead of typing yyyy-mm-dd by hand, while
   still exposing the value as a plain "yyyy-MM-dd" string so it slots
   into the same state shape the dialog already uses.
=============================================================== */

export interface DatePickerFieldProps {
  label: string;
  value: string; // yyyy-MM-dd, "" when empty
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  /** yyyy-MM-dd - dates after this are disabled (e.g. "no future DOB") */
  maxDate?: string;
  /** yyyy-MM-dd - dates before this are disabled (e.g. "expiry >= issue") */
  minDate?: string;
  disabled?: boolean;
  className?: string;
}

const toDate = (value: string): Date | undefined => {
  if (!value) return undefined;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
};

const toIsoDate = (date: Date): string => format(date, "yyyy-MM-dd");

const DatePickerField = ({
  label,
  value,
  onChange,
  required = false,
  placeholder = "Select date",
  maxDate,
  minDate,
  disabled = false,
  className,
}: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);

  const selectedDate = toDate(value);
  const maxDateObj = maxDate ? toDate(maxDate) : undefined;
  const minDateObj = minDate ? toDate(minDate) : undefined;

  const handleSelect = (date: Date | undefined): void => {
    if (!date) return;
    onChange(toIsoDate(date));
    setOpen(false);
  };

  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-9 w-full justify-start gap-2 text-left text-xs font-normal",
              !selectedDate && "text-slate-400"
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            {selectedDate ? format(selectedDate, "dd MMM yyyy") : placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            defaultMonth={selectedDate ?? maxDateObj ?? minDateObj}
            onSelect={handleSelect}
            disabled={(date: Date) =>
              (maxDateObj ? date > maxDateObj : false) ||
              (minDateObj ? date < minDateObj : false)
            }
            captionLayout="dropdown"
            startMonth={new Date(1930, 0)}
            endMonth={new Date(new Date().getFullYear() + 1, 11)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerField;