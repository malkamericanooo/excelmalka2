import { useState, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet, Download, RotateCcw, CheckCircle2,
  Info, ShieldCheck, AlertTriangle,
} from "lucide-react";
import { PatientRecord } from "@/lib/types";
import { parseExcelData } from "@/lib/mapping";
import { exportToExcel } from "@/lib/exporter";
import { validateAll, summarizeValidation } from "@/lib/validator";
import { UploadZone } from "@/components/UploadZone";
import { DataTable } from "@/components/DataTable";
import { EditModal } from "@/components/EditModal";
import { StatsBar } from "@/components/StatsBar";
import { ValidationPanel } from "@/components/ValidationPanel";
import { MappingPreview } from "@/components/MappingPreview";

type AppState = "idle" | "processing" | "ready";

export default function App() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [editTarget, setEditTarget] = useState<PatientRecord | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [parseInfo, setParseInfo] = useState<string>("");
  const [exportFilename, setExportFilename] = useState("fktpmar26_export.xlsx");
  const [showValidation, setShowValidation] = useState(false);
  const [isFormOffline, setIsFormOffline] = useState(false);

  // Compute validation summary reactively whenever records change
  const validationSummary = useMemo(() => {
    if (records.length === 0) return null;
    const issueMap = validateAll(records);
    return summarizeValidation(issueMap);
  }, [records]);

  const hasErrors = validationSummary?.hasBlockingErrors ?? false;
  const hasWarnings = (validationSummary?.warningCount ?? 0) > 0;

  const handleFileLoaded = useCallback(async (file: File) => {
    setAppState("processing");
    setFileName(file.name);
    setShowValidation(false);

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array", cellDates: true, cellText: false });

      const sheetName = wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];

      const rawData = XLSX.utils.sheet_to_json<unknown[]>(ws, {
        header: 1,
        defval: "",
        raw: false,
        dateNF: "dd-mm-yyyy",
      }) as unknown[][];

      const { records: parsed, headerRow } = parseExcelData(rawData, sheetName);
      const sheetLower = sheetName.toLowerCase();
      setIsFormOffline(sheetLower.includes("form offline") || sheetLower.includes("surveilan siptm"));
      setRecords(parsed);
      setParseInfo(
        `Sheet: "${sheetName}" · Header baris ke-${headerRow + 1} · ${parsed.length} data berhasil dipetakan`
      );

      const base = file.name.replace(/\.[^.]+$/, "");
      setExportFilename(`fktpmar26_${base}.xlsx`);
      setAppState("ready");

      // Auto-show validation panel after upload if there are issues
      const issueMap = validateAll(parsed);
      const summary = summarizeValidation(issueMap);
      if (summary.totalIssues > 0) setShowValidation(true);
    } catch (err) {
      console.error(err);
      setAppState("idle");
    }
  }, []);

  function handleEdit(record: PatientRecord) {
    setEditTarget(record);
  }

  function handleSave(updated: PatientRecord) {
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditTarget(null);
  }

  function handleDelete(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  function handleExport() {
    exportToExcel(records, exportFilename);
  }

  function handleReset() {
    setAppState("idle");
    setRecords([]);
    setFileName("");
    setParseInfo("");
    setEditTarget(null);
    setShowValidation(false);
    setIsFormOffline(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow">
              <FileSpreadsheet className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-none">SIPTM Converter</h1>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Form Offline → Template fktpmar26</p>
            </div>
          </div>

          {appState === "ready" && (
            <div className="flex items-center gap-2">
              {/* Validation badge */}
              {validationSummary && validationSummary.totalIssues > 0 && (
                <button
                  onClick={() => setShowValidation((v) => !v)}
                  className={[
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                    hasErrors
                      ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      : "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
                  ].join(" ")}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    {hasErrors
                      ? `${validationSummary.errorCount} Error`
                      : `${validationSummary.warningCount} Peringatan`}
                  </span>
                </button>
              )}
              {validationSummary && validationSummary.totalIssues === 0 && (
                <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Data Valid
                </span>
              )}

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Upload Baru</span>
              </button>

              <button
                onClick={handleExport}
                disabled={records.length === 0}
                title={hasErrors ? "Ada error pada data — disarankan perbaiki dulu sebelum export" : undefined}
                className={[
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
                  hasErrors ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700",
                ].join(" ")}
              >
                <Download className="h-3.5 w-3.5" />
                {hasErrors ? "Export (ada error)" : "Export fktpmar26"}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-6">

        {/* IDLE / PROCESSING */}
        {(appState === "idle" || appState === "processing") && (
          <div className="flex flex-col items-center justify-center gap-8 py-8">
            <div className="text-center max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                Surveilans PTM — Konversi Otomatis
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Upload file SIPTM,<br />
                <span className="text-blue-600">export template fktpmar26</span>
              </h2>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed">
                Upload file <strong>FORM OFFLINE SURVEILAN SIPTM</strong> (.xlsx). Sistem akan otomatis memetakan
                98 kolom ke format template fktpmar26 dengan pewarnaan sesuai standar.
              </p>
            </div>

            <UploadZone
              onFileLoaded={handleFileLoaded}
              isProcessing={appState === "processing"}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
              {[
                { title: "Upload Excel", desc: "Format FORM OFFLINE SURVEILAN SIPTM (.xlsx / .xls)", step: "1" },
                { title: "Validasi & Edit", desc: "Sistem cek otomatis NIK, tekanan darah, IMT, dan lainnya", step: "2" },
                { title: "Export fktpmar26", desc: "Download template Excel dengan warna dan format standar", step: "3" },
              ].map((s) => (
                <div key={s.step} className="flex gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* READY */}
        {appState === "ready" && (
          <div className="flex flex-col gap-5">
            {/* Success banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div className="flex items-start sm:items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">File berhasil diproses</p>
                  <p className="text-xs text-green-600 mt-0.5">{parseInfo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-slate-600 whitespace-nowrap hidden sm:block">Nama file export:</label>
                  <input
                    type="text"
                    value={exportFilename}
                    onChange={(e) => setExportFilename(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-400 w-48 sm:w-56"
                  />
                </div>
                <button
                  onClick={handleExport}
                  disabled={records.length === 0}
                  className={[
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-medium transition-colors shadow-sm shrink-0 disabled:opacity-50",
                    hasErrors ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700",
                  ].join(" ")}
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
              </div>
            </div>

            {/* Source info */}
            <div className="flex items-center gap-2 text-xs text-slate-500 -mt-2">
              <Info className="h-3.5 w-3.5" />
              <span>Sumber: <strong className="text-slate-700">{fileName}</strong></span>
              {(hasErrors || hasWarnings) && !showValidation && (
                <button
                  onClick={() => setShowValidation(true)}
                  className={[
                    "ml-2 underline underline-offset-2 font-medium",
                    hasErrors ? "text-red-600" : "text-yellow-600",
                  ].join(" ")}
                >
                  Lihat hasil validasi →
                </button>
              )}
            </div>

            {/* Validation Panel (collapsible) */}
            {showValidation && (
              <ValidationPanel
                records={records}
                onDismiss={() => setShowValidation(false)}
              />
            )}

            {/* Mapping Preview (collapsible) */}
            <MappingPreview records={records} isFormOffline={isFormOffline} />

            {/* Stats */}
            <StatsBar records={records} />

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-800">Data Pasien</h3>
                <div className="flex items-center gap-2">
                  {!showValidation && validationSummary && validationSummary.totalIssues > 0 && (
                    <button
                      onClick={() => setShowValidation(true)}
                      className={[
                        "flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium",
                        hasErrors
                          ? "border-red-200 text-red-600 bg-red-50"
                          : "border-yellow-200 text-yellow-600 bg-yellow-50",
                      ].join(" ")}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {validationSummary.totalIssues} isu
                    </button>
                  )}
                  <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {records.length} record
                  </span>
                </div>
              </div>
              <DataTable
                records={records}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            {/* Export note */}
            <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100 px-4 py-3">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <div>
                <strong className="text-slate-700">Format export:</strong> File Excel (.xlsx) dengan 2 baris header,
                pewarnaan per kelompok data, dan freeze panel. Sesuai template fktpmar26.
                Buka dengan Microsoft Excel atau LibreOffice Calc.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-4">
        <p className="text-center text-xs text-slate-400">
          SIPTM Converter · Surveilans Penyakit Tidak Menular · Data diproses di browser, tidak dikirim ke server
        </p>
      </footer>

      <EditModal
        record={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleSave}
      />
    </div>
  );
}
