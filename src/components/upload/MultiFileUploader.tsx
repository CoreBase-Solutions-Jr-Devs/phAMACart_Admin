import { useEffect, useRef, useState } from "react";

export type UploadFileItem = {
  file: File | null;
  preview: string;
  id: string;
};

interface Props {
  value: UploadFileItem[];
  onChange: (files: UploadFileItem[]) => void;
  multiple?: boolean;
  readOnly?: boolean;
  accept?: string;
}

const isImagePreview = (url: string) =>
  url.startsWith("blob:") || /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(url);

const MultiFileUploader = ({
  value,
  onChange,
  readOnly,
  multiple = true,
  accept = "image/*",
}: Props) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    const newFiles: UploadFileItem[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }));

    onChange(multiple ? [...value, ...newFiles] : newFiles.slice(0, 1));
  };

  const removeFile = (id: string) =>
    onChange(value.filter((f) => f.id !== id));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (readOnly) return;
    handleFiles(e.dataTransfer.files);
  };

  // Revoke any blob: URLs we created on unmount to avoid leaking memory.
  useEffect(() => {
    return () => {
      value.forEach((v) => {
        if (v.file && v.preview.startsWith("blob:")) {
          URL.revokeObjectURL(v.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div
        onClick={() => {
          if (readOnly) return;
          inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!readOnly) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition
          ${readOnly ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            // Reset so picking the same file twice still fires onChange.
            e.target.value = "";
          }}
          disabled={readOnly}
        />
        <p className="text-sm text-gray-600">
          Drag &amp; drop files or{" "}
          <span className="text-blue-600 underline">click to upload</span>
        </p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {value.map((f) => (
            <div
              key={f.id}
              className="relative border rounded-lg overflow-hidden"
            >
              {isImagePreview(f.preview) ? (
                <img
                  src={f.preview}
                  className="h-32 w-full object-cover"
                  alt=""
                />
              ) : (
                <div className="h-32 w-full flex items-center justify-center text-xs text-gray-600 bg-gray-50 p-2 break-all">
                  {f.file?.name ?? "File"}
                </div>
              )}

              {!readOnly && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(f.id);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiFileUploader;