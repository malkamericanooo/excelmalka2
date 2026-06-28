import { useRef, useState, DragEvent } from "react";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";

interface UploadZoneProps {
  onFileLoaded: (file: File) => void;
  isProcessing: boolean;
}

export function UploadZone({ onFileLoaded, isProcessing }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    setError(null);
    const valid = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!valid.includes(file.type) && !file.name.match(/\.xlsx?$/i)) {
      setError("Format file tidak didukung. Harap upload file .xlsx atau .xls");
      return;
    }
    onFileLoaded(file);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={() => !isProcessing && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={[
          "relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 transition-all duration-200 cursor-pointer select-none",
          isDragging
            ? "border-blue-500 bg-blue-50 scale-[1.01]"
            : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50",
          isProcessing ? "opacity-60 cursor-not-allowed pointer-events-none" : "",
        ].join(" ")}
      >
        <div className={[
          "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
          isDragging ? "bg-blue-100" : "bg-white shadow-sm border border-slate-200",
        ].join(" ")}>
          {isProcessing ? (
            <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
          ) : (
            <FileSpreadsheet className="h-8 w-8 text-blue-600" />
          )}
        </div>

        <div className="text-center">
          <p className="text-base font-semibold text-slate-800">
            {isProcessing ? "Memproses file..." : "Upload File Excel SIPTM"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {isProcessing
              ? "Sedang membaca dan memetakan kolom..."
              : "Drag & drop atau klik untuk pilih file .xlsx / .xls"}
          </p>
        </div>

        {!isProcessing && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition-colors">
            <Upload className="h-4 w-4" />
            Pilih File
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={onInputChange}
          className="hidden"
        />
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          Format: FORM OFFLINE SURVEILAN SIPTM
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          Output: fktpmar26.xlsx
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          98 kolom otomatis dipetakan
        </span>
      </div>
    </div>
  );
}
