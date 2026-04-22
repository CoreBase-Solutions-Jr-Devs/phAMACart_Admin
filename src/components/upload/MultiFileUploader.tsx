import { useState } from "react";

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
}

const MultiFileUploader = ({
  value,
  onChange,
  readOnly,
  multiple = true,
}: Props) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | File[]) => {
    const newFiles: UploadFileItem[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }));

    onChange(multiple ? [...value, ...newFiles] : newFiles.slice(0, 1));
  };

  const removeFile = (id: string) => {
    onChange(value.filter((f) => f.id !== id));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {/* DROPZONE */}
      <div
        onClick={() => {
          if (readOnly) return;
          document.getElementById("fileInput")?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
      >
        <input
          id="fileInput"
          type="file"
          multiple={multiple}
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          disabled={readOnly}
        />

        <p className="text-sm text-gray-600">
          Drag & drop images or{" "}
          <span className="text-blue-600 underline">click to upload</span>
        </p>
      </div>

      {/* GRID PREVIEW */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {value.map((f) => (
            <div
              key={f.id}
              className="relative border rounded-lg overflow-hidden"
            >
              <img src={f.preview} className="h-32 w-full object-cover" />

              <button
                type="button"
                onClick={() => removeFile(f.id)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiFileUploader;
