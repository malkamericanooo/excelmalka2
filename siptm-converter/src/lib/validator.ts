import { PatientRecord } from "./types";

// ---------------------------------------------------------------------------
// Severity levels
// ---------------------------------------------------------------------------

export const SEVERITY = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

export type Severity = (typeof SEVERITY)[keyof typeof SEVERITY];

export interface ValidationIssue {
  field: keyof PatientRecord;
  message: string;
  severity: Severity;
}

// ---------------------------------------------------------------------------
// Individual field validators (pure functions)
// ---------------------------------------------------------------------------

function validateNik(nik: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const s = String(nik ?? "").trim();

  if (s === "") {
    return [{ field: "nik", message: "NIK wajib diisi", severity: SEVERITY.ERROR }];
  }
  if (!/^\d+$/.test(s)) {
    issues.push({ field: "nik", message: `NIK harus berupa angka — ditemukan "${s}"`, severity: SEVERITY.ERROR });
  } else if (s.length !== 16) {
    issues.push({
      field: "nik",
      message: `NIK harus 16 digit — ditemukan ${s.length} digit`,
      severity: SEVERITY.ERROR,
    });
  } else if (/^(\d)\1{15}$/.test(s)) {
    // All same digit (e.g. 1111111111111111) → likely test/dummy data
    issues.push({
      field: "nik",
      message: "NIK terlihat seperti data uji (semua digit sama)",
      severity: SEVERITY.WARNING,
    });
  }
  return issues;
}

function validateNama(namaPasien: string): ValidationIssue[] {
  const s = String(namaPasien ?? "").trim();
  if (s === "") {
    return [{ field: "namaPasien", message: "Nama pasien wajib diisi", severity: SEVERITY.ERROR }];
  }
  if (s.length === 1) {
    return [{ field: "namaPasien", message: "Nama terlalu pendek (1 karakter)", severity: SEVERITY.WARNING }];
  }
  return [];
}

function validateBloodPressure(
  sistol: string | number,
  diastol: string | number
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const s = Number(sistol);
  const d = Number(diastol);
  const sEmpty = sistol === "" || sistol === null || sistol === undefined;
  const dEmpty = diastol === "" || diastol === null || diastol === undefined;

  if (sEmpty && dEmpty) {
    issues.push({ field: "sistol", message: "Tekanan darah belum diisi", severity: SEVERITY.WARNING });
    return issues;
  }

  if (!sEmpty && !isNaN(s)) {
    if (s < 60) {
      issues.push({ field: "sistol", message: `Sistol ${s} mmHg terlalu rendah (< 60)`, severity: SEVERITY.ERROR });
    } else if (s > 280) {
      issues.push({ field: "sistol", message: `Sistol ${s} mmHg terlalu tinggi (> 280)`, severity: SEVERITY.ERROR });
    }
  }

  if (!dEmpty && !isNaN(d)) {
    if (d < 30) {
      issues.push({ field: "diastol", message: `Diastol ${d} mmHg terlalu rendah (< 30)`, severity: SEVERITY.ERROR });
    } else if (d > 160) {
      issues.push({ field: "diastol", message: `Diastol ${d} mmHg terlalu tinggi (> 160)`, severity: SEVERITY.ERROR });
    }
  }

  // Cross-field: sistol must be > diastol
  if (!sEmpty && !dEmpty && !isNaN(s) && !isNaN(d) && s <= d) {
    issues.push({
      field: "sistol",
      message: `Sistol (${s}) tidak boleh ≤ Diastol (${d}) — periksa kembali`,
      severity: SEVERITY.WARNING,
    });
  }

  return issues;
}

function validateTinggiBadan(tinggiBadan: string | number): ValidationIssue[] {
  const s = String(tinggiBadan ?? "").trim();
  if (s === "") {
    return [{ field: "tinggiBadan", message: "Tinggi badan belum diisi", severity: SEVERITY.WARNING }];
  }
  const v = Number(s);
  if (isNaN(v)) return [];
  if (v < 50) {
    return [{ field: "tinggiBadan", message: `Tinggi badan ${v} cm sangat rendah (< 50 cm)`, severity: SEVERITY.ERROR }];
  }
  if (v > 260) {
    return [{ field: "tinggiBadan", message: `Tinggi badan ${v} cm sangat tinggi (> 260 cm)`, severity: SEVERITY.ERROR }];
  }
  return [];
}

function validateBeratBadan(beratBadan: string | number): ValidationIssue[] {
  const s = String(beratBadan ?? "").trim();
  if (s === "") {
    return [{ field: "beratBadan", message: "Berat badan belum diisi", severity: SEVERITY.WARNING }];
  }
  const v = Number(s);
  if (isNaN(v)) return [];
  if (v < 2) {
    return [{ field: "beratBadan", message: `Berat badan ${v} kg sangat rendah (< 2 kg)`, severity: SEVERITY.ERROR }];
  }
  if (v > 300) {
    return [{ field: "beratBadan", message: `Berat badan ${v} kg sangat tinggi (> 300 kg)`, severity: SEVERITY.ERROR }];
  }
  return [];
}

function validateImt(imt: string | number): ValidationIssue[] {
  const s = String(imt ?? "").trim();
  if (s === "") return []; // Not mandatory
  const v = Number(s);
  if (isNaN(v)) return [];
  if (v < 15) {
    return [{ field: "imt", message: `IMT ${v} sangat rendah (< 15) — kemungkinan kesalahan input`, severity: SEVERITY.WARNING }];
  }
  if (v > 60) {
    return [{ field: "imt", message: `IMT ${v} sangat tinggi (> 60) — kemungkinan kesalahan input`, severity: SEVERITY.WARNING }];
  }
  return [];
}

function validateGulaDarah(gds: string | number): ValidationIssue[] {
  const s = String(gds ?? "").trim();
  if (s === "") return []; // Optional field
  const v = Number(s);
  if (isNaN(v)) return [];
  if (v < 40) {
    return [{ field: "pemeriksaanGulaDarah", message: `Gula darah ${v} sangat rendah (< 40) — periksa kembali`, severity: SEVERITY.WARNING }];
  }
  if (v > 600) {
    return [{ field: "pemeriksaanGulaDarah", message: `Gula darah ${v} sangat tinggi (> 600) — kemungkinan kesalahan input`, severity: SEVERITY.WARNING }];
  }
  return [];
}

function validateUsia(usia: string | number): ValidationIssue[] {
  const s = String(usia ?? "").trim();
  if (s === "") {
    return [{ field: "usia", message: "Usia belum diisi", severity: SEVERITY.WARNING }];
  }
  const v = Number(s);
  if (isNaN(v)) return [];
  if (v < 0) {
    return [{ field: "usia", message: `Usia ${v} tidak valid (negatif)`, severity: SEVERITY.ERROR }];
  }
  if (v > 120) {
    return [{ field: "usia", message: `Usia ${v} tahun sangat tinggi (> 120) — periksa kembali`, severity: SEVERITY.WARNING }];
  }
  return [];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Validate a single PatientRecord, return all found issues */
export function validateRecord(record: PatientRecord): ValidationIssue[] {
  return [
    ...validateNik(String(record.nik ?? "")),
    ...validateNama(String(record.namaPasien ?? "")),
    ...validateBloodPressure(record.sistol, record.diastol),
    ...validateTinggiBadan(record.tinggiBadan),
    ...validateBeratBadan(record.beratBadan),
    ...validateImt(record.imt),
    ...validateGulaDarah(record.pemeriksaanGulaDarah),
    ...validateUsia(record.usia),
  ];
}

export interface ValidationSummary {
  totalIssues: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  affectedRecords: number;
  hasBlockingErrors: boolean;
}

/** Validate all records, return a Map<recordId, issues[]> */
export function validateAll(records: PatientRecord[]): Map<string, ValidationIssue[]> {
  const result = new Map<string, ValidationIssue[]>();
  for (const record of records) {
    const issues = validateRecord(record);
    result.set(record.id, issues);
  }
  return result;
}

/** Compute aggregate summary from a validation map */
export function summarizeValidation(
  issueMap: Map<string, ValidationIssue[]>
): ValidationSummary {
  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;
  let affectedRecords = 0;

  for (const issues of issueMap.values()) {
    if (issues.length > 0) affectedRecords++;
    for (const issue of issues) {
      if (issue.severity === SEVERITY.ERROR) errorCount++;
      else if (issue.severity === SEVERITY.WARNING) warningCount++;
      else infoCount++;
    }
  }

  return {
    totalIssues: errorCount + warningCount + infoCount,
    errorCount,
    warningCount,
    infoCount,
    affectedRecords,
    hasBlockingErrors: errorCount > 0,
  };
}
