import { cn } from "@/lib/utils";

interface InlineFieldProps {
  label: string;
  value: string;
  className?: string;
}

export const InlineField = ({ label, value, className = "" }: InlineFieldProps) => (
  <div className={cn("min-w-0 shrink-0", className)}>
    <div className="flex items-baseline gap-1.5 whitespace-nowrap">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}:
      </span>
      <span className="max-w-[180px] truncate text-xs font-semibold text-slate-800" title={value}>
        {value}
      </span>
    </div>
  </div>
);

export const InlineDivider = () => <div className="h-4 w-px shrink-0 bg-slate-200" />;

export default InlineField;