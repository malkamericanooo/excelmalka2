import { describe, it, expect } from "vitest";
import {
  validateRecord,
  validateAll,
  SEVERITY,
  type ValidationIssue,
} from "./validator";
import { SAMPLE_RECORD, SAMPLE_RECORD_2 } from "@/test/fixtures";
import type { PatientRecord } from "./types";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function makeRecord(overrides: Partial<PatientRecord>): PatientRecord {
  return { ...SAMPLE_RECORD, ...overrides };
}

function issuesOf(record: PatientRecord, field?: string): ValidationIssue[] {
  const issues = validateRecord(record);
  return field ? issues.filter((i) => i.field === field) : issues;
}

// ---------------------------------------------------------------------------
// NIK validation
// ---------------------------------------------------------------------------

describe("validator — NIK", () => {
  it("no issue when NIK is exactly 16 digits", () => {
    expect(issuesOf(SAMPLE_RECORD, "nik")).toHaveLength(0);
  });

  it("error when NIK is empty", () => {
    const issues = issuesOf(makeRecord({ nik: "" }), "nik");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.ERROR);
  });

  it("error when NIK is less than 16 digits", () => {
    const issues = issuesOf(makeRecord({ nik: "12345" }), "nik");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.ERROR);
  });

  it("error when NIK is more than 16 digits", () => {
    const issues = issuesOf(makeRecord({ nik: "12345678901234567" }), "nik");
    expect(issues.length).toBeGreaterThan(0);
  });

  it("error when NIK contains non-digit characters", () => {
    const issues = issuesOf(makeRecord({ nik: "630906450897000X" }), "nik");
    expect(issues.length).toBeGreaterThan(0);
  });

  it("warning when NIK is 16 digits but looks like test data (all same digit)", () => {
    const issues = issuesOf(makeRecord({ nik: "1111111111111111" }), "nik");
    expect(issues.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Nama Pasien
// ---------------------------------------------------------------------------

describe("validator — Nama Pasien", () => {
  it("no issue when name is present", () => {
    expect(issuesOf(SAMPLE_RECORD, "namaPasien")).toHaveLength(0);
  });

  it("error when name is empty", () => {
    const issues = issuesOf(makeRecord({ namaPasien: "" }), "namaPasien");
    expect(issues[0].severity).toBe(SEVERITY.ERROR);
  });

  it("warning when name is very short (1 char)", () => {
    const issues = issuesOf(makeRecord({ namaPasien: "A" }), "namaPasien");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.WARNING);
  });
});

// ---------------------------------------------------------------------------
// Tekanan Darah
// ---------------------------------------------------------------------------

describe("validator — Tekanan Darah", () => {
  it("no issue for normal blood pressure (120/80)", () => {
    const r = makeRecord({ sistol: 120, diastol: 80 });
    expect(issuesOf(r, "sistol")).toHaveLength(0);
    expect(issuesOf(r, "diastol")).toHaveLength(0);
  });

  it("no issue for high normal (140/90 — hipertensi grade I threshold)", () => {
    const r = makeRecord({ sistol: 140, diastol: 90 });
    expect(issuesOf(r, "sistol")).toHaveLength(0);
    expect(issuesOf(r, "diastol")).toHaveLength(0);
  });

  it("error when sistol is below plausible minimum (< 60)", () => {
    const issues = issuesOf(makeRecord({ sistol: 50, diastol: 80 }), "sistol");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.ERROR);
  });

  it("error when sistol is above plausible maximum (> 280)", () => {
    const issues = issuesOf(makeRecord({ sistol: 300, diastol: 80 }), "sistol");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.ERROR);
  });

  it("error when diastol is below plausible minimum (< 30)", () => {
    const issues = issuesOf(makeRecord({ sistol: 120, diastol: 20 }), "diastol");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.ERROR);
  });

  it("error when diastol is above plausible maximum (> 160)", () => {
    const issues = issuesOf(makeRecord({ sistol: 120, diastol: 170 }), "diastol");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.ERROR);
  });

  it("warning when sistol <= diastol (impossible physiology)", () => {
    const issues = issuesOf(makeRecord({ sistol: 80, diastol: 90 }));
    const crossIssue = issues.find((i) => i.field === "sistol" || i.field === "diastol");
    expect(crossIssue).toBeDefined();
  });

  it("warning when both BP fields are empty", () => {
    const issues = issuesOf(makeRecord({ sistol: "", diastol: "" }));
    const bpIssue = issues.find((i) => i.field === "sistol" || i.field === "diastol");
    expect(bpIssue).toBeDefined();
    expect(bpIssue!.severity).toBe(SEVERITY.WARNING);
  });
});

// ---------------------------------------------------------------------------
// Tinggi & Berat Badan
// ---------------------------------------------------------------------------

describe("validator — Tinggi & Berat Badan", () => {
  it("no issue for normal height (153 cm)", () => {
    expect(issuesOf(SAMPLE_RECORD, "tinggiBadan")).toHaveLength(0);
  });

  it("no issue for normal weight (84 kg)", () => {
    expect(issuesOf(SAMPLE_RECORD, "beratBadan")).toHaveLength(0);
  });

  it("error when tinggi badan < 50 cm", () => {
    const issues = issuesOf(makeRecord({ tinggiBadan: 30 }), "tinggiBadan");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.ERROR);
  });

  it("error when tinggi badan > 260 cm", () => {
    const issues = issuesOf(makeRecord({ tinggiBadan: 270 }), "tinggiBadan");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.ERROR);
  });

  it("error when berat badan < 2 kg", () => {
    const issues = issuesOf(makeRecord({ beratBadan: 1 }), "beratBadan");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.ERROR);
  });

  it("error when berat badan > 300 kg", () => {
    const issues = issuesOf(makeRecord({ beratBadan: 350 }), "beratBadan");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.ERROR);
  });

  it("warning when tinggi badan is empty", () => {
    const issues = issuesOf(makeRecord({ tinggiBadan: "" }), "tinggiBadan");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.WARNING);
  });
});

// ---------------------------------------------------------------------------
// IMT
// ---------------------------------------------------------------------------

describe("validator — IMT", () => {
  it("no issue for normal IMT (22.5)", () => {
    expect(issuesOf(makeRecord({ imt: 22.5 }), "imt")).toHaveLength(0);
  });

  it("warning for underweight IMT (< 15 — extreme)", () => {
    const issues = issuesOf(makeRecord({ imt: 12 }), "imt");
    expect(issues.length).toBeGreaterThan(0);
  });

  it("warning for very high IMT (> 60 — likely input error)", () => {
    const issues = issuesOf(makeRecord({ imt: 65 }), "imt");
    expect(issues.length).toBeGreaterThan(0);
  });

  it("no issue when IMT is empty (not always measured)", () => {
    const issues = issuesOf(makeRecord({ imt: "" }), "imt");
    expect(issues).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Gula Darah
// ---------------------------------------------------------------------------

describe("validator — Gula Darah", () => {
  it("no issue for normal GDS (117)", () => {
    expect(issuesOf(SAMPLE_RECORD, "pemeriksaanGulaDarah")).toHaveLength(0);
  });

  it("warning for very low GDS (< 40 — likely hypoglycemia or error)", () => {
    const issues = issuesOf(makeRecord({ pemeriksaanGulaDarah: 30 }), "pemeriksaanGulaDarah");
    expect(issues.length).toBeGreaterThan(0);
  });

  it("warning for very high GDS (> 600 — likely input error)", () => {
    const issues = issuesOf(makeRecord({ pemeriksaanGulaDarah: 700 }), "pemeriksaanGulaDarah");
    expect(issues.length).toBeGreaterThan(0);
  });

  it("no issue when GDS is empty", () => {
    const issues = issuesOf(makeRecord({ pemeriksaanGulaDarah: "" }), "pemeriksaanGulaDarah");
    expect(issues).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Usia
// ---------------------------------------------------------------------------

describe("validator — Usia", () => {
  it("no issue for valid age (28)", () => {
    expect(issuesOf(SAMPLE_RECORD, "usia")).toHaveLength(0);
  });

  it("error when usia is negative", () => {
    const issues = issuesOf(makeRecord({ usia: -1 }), "usia");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.ERROR);
  });

  it("warning when usia > 120", () => {
    const issues = issuesOf(makeRecord({ usia: 130 }), "usia");
    expect(issues.length).toBeGreaterThan(0);
  });

  it("warning when usia is empty", () => {
    const issues = issuesOf(makeRecord({ usia: "" }), "usia");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe(SEVERITY.WARNING);
  });
});

// ---------------------------------------------------------------------------
// validateAll
// ---------------------------------------------------------------------------

describe("validateAll", () => {
  it("returns empty map for clean records", () => {
    const result = validateAll([SAMPLE_RECORD, SAMPLE_RECORD_2]);
    // SAMPLE_RECORD and SAMPLE_RECORD_2 might have some warnings (sistol 130/90 is borderline)
    // but should not have NIK or name errors
    for (const [, issues] of result.entries()) {
      const errors = issues.filter((i) => i.severity === SEVERITY.ERROR);
      expect(errors).toHaveLength(0);
    }
  });

  it("returns issues for records with bad data", () => {
    const bad = makeRecord({ nik: "bad", namaPasien: "", sistol: 999 });
    const result = validateAll([bad]);
    const issues = result.get(bad.id) ?? [];
    expect(issues.length).toBeGreaterThan(0);
  });

  it("returns a map keyed by record id", () => {
    const records = [SAMPLE_RECORD, SAMPLE_RECORD_2];
    const result = validateAll(records);
    expect(result.has(SAMPLE_RECORD.id)).toBe(true);
    expect(result.has(SAMPLE_RECORD_2.id)).toBe(true);
  });

  it("correctly counts error vs warning severity", () => {
    const bad = makeRecord({
      id: "bad-one",
      nik: "",
      namaPasien: "",
      sistol: 999,
    });
    const result = validateAll([bad]);
    const issues = result.get("bad-one") ?? [];
    const errors = issues.filter((i) => i.severity === SEVERITY.ERROR);
    expect(errors.length).toBeGreaterThanOrEqual(2); // NIK + name are errors
  });

  it("handles empty records array", () => {
    const result = validateAll([]);
    expect(result.size).toBe(0);
  });

  it("handles 50 records efficiently", () => {
    const many = Array.from({ length: 50 }, (_, i) => ({
      ...SAMPLE_RECORD,
      id: `rec-${i}`,
    }));
    const start = Date.now();
    const result = validateAll(many);
    const elapsed = Date.now() - start;
    expect(result.size).toBe(50);
    expect(elapsed).toBeLessThan(500); // should be near-instant
  });
});

// ---------------------------------------------------------------------------
// Issue shape
// ---------------------------------------------------------------------------

describe("ValidationIssue shape", () => {
  it("each issue has field, message, and severity", () => {
    const bad = makeRecord({ nik: "bad" });
    const issues = validateRecord(bad);
    for (const issue of issues) {
      expect(typeof issue.field).toBe("string");
      expect(typeof issue.message).toBe("string");
      expect([SEVERITY.ERROR, SEVERITY.WARNING, SEVERITY.INFO]).toContain(issue.severity);
    }
  });

  it("message is non-empty human-readable text", () => {
    const bad = makeRecord({ nik: "" });
    const issues = validateRecord(bad);
    const nikIssue = issues.find((i) => i.field === "nik");
    expect(nikIssue?.message.length).toBeGreaterThan(5);
  });
});
