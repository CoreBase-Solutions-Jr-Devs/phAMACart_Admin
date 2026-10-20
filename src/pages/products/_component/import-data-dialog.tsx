import { useRef, useState } from "react";
import { toast } from "sonner";
import { FileSpreadsheet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useImportProductDataMutation } from "@/features/products/productsAPI";
import { parseError } from "@/lib/parse-error";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ImportResult = {
  totalRows: number;
  updated: number;
  notFound: number;
  alreadyHadDescription: number;
};

/** Uploads an Excel sheet that fills in missing product descriptions. */
export const ImportDataDialog = ({ open, onOpenChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importData, { isLoading }] = useImportProductDataMutation();

  const close = (next: boolean) => {
    if (!next) {
      setFile(null);
      setResult(null);
      if (inputRef.current) inputRef.current.value = "";
    }
    onOpenChange(next);
  };

  const submit = async () => {
    if (!file) return;

    try {
      const res = await importData(file).unwrap();
      setResult(res);
      toast.success(`Import finished: ${res.updated} products updated.`);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import product descriptions</DialogTitle>
          <DialogDescription>
            Upload the Excel workbook of product details. Rows are matched to existing products;
            products that already have a description are left alone.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <dl className="grid grid-cols-2 gap-3 rounded-md border p-4 text-sm">
            <dt className="text-muted-foreground">Rows read</dt>
            <dd className="text-right font-semibold tabular-nums">{result.totalRows}</dd>
            <dt className="text-muted-foreground">Updated</dt>
            <dd className="text-right font-semibold tabular-nums text-green-600">{result.updated}</dd>
            <dt className="text-muted-foreground">Already had a description</dt>
            <dd className="text-right font-semibold tabular-nums">{result.alreadyHadDescription}</dd>
            <dt className="text-muted-foreground">No matching product</dt>
            <dd className="text-right font-semibold tabular-nums text-amber-600">{result.notFound}</dd>
          </dl>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-md border border-dashed p-6 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
          >
            <FileSpreadsheet className="size-8" />
            {file ? (
              <span className="font-medium text-foreground">{file.name}</span>
            ) : (
              <span>Choose an .xlsx file</span>
            )}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => close(false)} disabled={isLoading}>
            {result ? "Done" : "Cancel"}
          </Button>
          {!result && (
            <Button onClick={submit} disabled={!file || isLoading}>
              {isLoading ? "Importing…" : "Import"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
