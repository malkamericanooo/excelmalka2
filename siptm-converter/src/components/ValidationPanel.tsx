import { useMemo, useState } from "react";
import {
  AlertTriangle,
  XCircle,
  Info,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  validateAll,
  summarizeValidation,
  SEVERITY,
  type ValidationIssue,
} from "@/lib/validator";
import type { PatientRecord } from "@/lib/types";

interface ValidationPanelProps {
  records: PatientRecord[];
  onDismiss: () => void;
}

const SEVERITY_CONFIG = {
  [SEVERITY.ERROR]: {
    icon: <XCircle className="h-4 w-4 shrink-0" />,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    label: "Error",
  },
  [SEVERITY.WARNING]: {
    icon: <AlertTriangle className="h-4 w-4 shrink-0" />,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
    label: "Peringatan",
  },
  [SEVERITY.INFO]: {
    icon: <Info className="h-4 w-4 shrink-0" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    label: "Info",
  },
} as const;

function IssueChip({ issue }: { issue: ValidationIssue }) {
  const cfg = SEVERITY_CONFIG[issue.severity];
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${cfg.color}`}>
      {cfg.icon}
      {issue.message}
    </span>
  );
}

function RecordRow({
  record,
  issues,
}: {
  record: PatientRecord;
  issues: ValidationIssue[];
}) {
  const [open, setOpen] = useState(false);
  const errors = issues.filter((i) => i.severity === SEVERITY.ERROR);
  const warnings = issues.filter((i) => i.severity === SEVERITY.WARNING);
  const hasError = errors.length > 0;

  return (
    <div
      className={[
        "rounded-lg border overflow-hidden",
        hasError ? "border-red-200" : "border-yellow-200",
      ].join(" ")}
    >
      <button
        className={[
          "w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors",
          hasError ? "bg-red-50 hover:bg-red-100/70" : "bg-yellow-50 hover:bg-yellow-100/70",
        ].join(" ")}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-2 min-w-0">
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          )}
          <span className="text-sm font-medium text-slate-800 truncate">
            {record.namaPasien || "Nama kosong"}
          </span>
          <span className="text-xs text-slate-500 truncate hidden sm:block">
            NIK: {record.nik || "—"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {errors.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
              {errors.length} error
            </span>
          )}
          {warnings.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
              {warnings.length} peringatan
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="px-3 py-2.5 bg-white border-t border-slate-100 space-y-1.5">
          {issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-2">
              <IssueChip issue={issue} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ValidationPanel({ records, onDismiss }: ValidationPanelProps) {
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);

  const issueMap = useMemo(() => validateAll(records), [records]);
  const summary = useMemo(() => summarizeValidation(issueMap), [issueMap]);

  const affectedEntries = useMemo(() => {
    const entries: Array<{ record: PatientRecord; issues: ValidationIssue[] }> = [];
    for (const record of records) {
      const issues = issueMap.get(record.id) ?? [];
      if (issues.length === 0) continue;
      if (showOnlyErrors && !issues.some((i) => i.severity === SEVERITY.ERROR)) continue;
      entries.push({ record, issues });
    }
    return entries;
  }, [records, issueMap, showOnlyErrors]);

  if (summary.totalIssues === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-green-800">Semua data valid</p>
          <p className="text-xs text-green-600 mt-0.5">
            {records.length} record diperiksa, tidak ada masalah ditemukan
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="ml-auto p-1 text-green-500 hover:text-green-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className={[
          "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b",
          summary.hasBlockingErrors
            ? "bg-red-50 border-red-200"
            : "bg-yellow-50 border-yellow-200",
        ].join(" ")}
      >
        <div className="flex items-start sm:items-center gap-3">
          {summary.hasBlockingErrors ? (
            <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5 sm:mt-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5 sm:mt-0" />
          )}
          <div>
            <p className={`text-sm font-semibold ${summary.hasBlockingErrors ? "text-red-800" : "text-yellow-800"}`}>
              {summary.hasBlockingErrors
                ? "Ditemukan error — periksa data sebelum export"
                : "Ada peringatan data — export tetap bisa dilanjutkan"}
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {summary.errorCount > 0 && (
                <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                  {summary.errorCount} error
                </span>
              )}
              {summary.warningCount > 0 && (
                <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
                  {summary.warningCount} peringatan
                </span>
              )}
              <span className="text-xs text-slate-500">
                di {summary.affectedRecords} dari {records.length} record
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {summary.errorCount > 0 && summary.warningCount > 0 && (
            <button
              onClick={() => setShowOnlyErrors((v) => !v)}
              className="text-xs px-2.5 py-1 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {showOnlyErrors ? "Tampilkan semua" : "Error saja"}
            </button>
          )}
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-colors"
            title="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Record list */}
      <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
        {affectedEntries.length === 0 ? (
          <div className="flex items-center gap-2 py-4 justify-center text-sm text-slate-400">
            <CheckCircle2 className="h-4 w-4" />
            Tidak ada error — hanya peringatan
          </div>
        ) : (
          affectedEntries.map(({ record, issues }) => (
            <RecordRow key={record.id} record={record} issues={issues} />
          ))
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-4 py-2.5 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
        <span className="flex items-center gap-1 text-red-600">
          <XCircle className="h-3 w-3" /> Error: wajib diperbaiki
        </span>
        <span className="flex items-center gap-1 text-yellow-600">
          <AlertTriangle className="h-3 w-3" /> Peringatan: perlu diverifikasi
        </span>
      </div>
    </div>
  );
}
