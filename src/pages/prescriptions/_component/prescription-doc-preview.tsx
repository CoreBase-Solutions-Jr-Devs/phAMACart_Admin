import { useMemo, useState } from "react";
import { ExternalLink, FileText, FileWarning, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  documentBlobPath: string | null | undefined;
}

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif"];

function getExtension(path: string): string {
  const clean = path.split("?")[0].split("#")[0];
  return clean.split(".").pop()?.toLowerCase() ?? "";
}

const PrescriptionDocumentPreview = ({ documentBlobPath }: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const kind = useMemo(() => {
    if (!documentBlobPath) return "none";
    const ext = getExtension(documentBlobPath);
    if (ext === "pdf") return "pdf";
    if (IMAGE_EXTENSIONS.includes(ext)) return "image";
    return "unknown";
  }, [documentBlobPath]);

  return (
    <div className="flex h-full flex-col rounded-xl border bg-white">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Prescription Document
          </h3>
          <p className="text-xs text-slate-500">Review uploaded prescription</p>
        </div>

        {kind !== "none" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2 text-xs"
            onClick={() => window.open(documentBlobPath!, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </Button>
        )}
      </div>

      <div className="relative flex-1 overflow-hidden rounded-b-xl bg-slate-50">
        {kind === "none" && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <FileText className="h-10 w-10" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-500">No document uploaded</p>
          </div>
        )}

        {kind !== "none" && !loaded && !failed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {kind !== "none" && (failed || kind === "unknown") && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <FileWarning className="h-6 w-6" />
            <span>Preview not supported for this file type.</span>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => window.open(documentBlobPath!, "_blank", "noopener,noreferrer")}
            >
              Open the document instead
            </Button>
          </div>
        )}

        {kind === "image" && (
          <img
            src={documentBlobPath!}
            alt="Prescription document"
            className="h-full w-full object-contain"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}

        {kind === "pdf" && (
          <iframe
            src={documentBlobPath!}
            title="Prescription document"
            className="h-full w-full"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  );
};

export default PrescriptionDocumentPreview;