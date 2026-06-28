import { describe, it, expect, vi, beforeEach } from "vitest";
import { recordToPreview, recordToRow, COL_COLORS, TOTAL_COLS } from "./exporter";
import { SAMPLE_RECORD, SAMPLE_RECORD_2 } from "@/test/fixtures";
import type { PatientRecord } from "@/lib/types";

// ---------------------------------------------------------------------------
// TDD: recordToRow — column count & positions (fktpmar26 exact structure)
// ---------------------------------------------------------------------------

describe("recordToRow — column count", () => {
  it("produces exactly 62 columns", () => {
    expect(recordToRow(SAMPLE_RECORD, 0)).toHaveLength(62);
  });

  it("TOTAL_COLS constant equals 62", () => {
    expect(TOTAL_COLS).toBe(62);
  });
});

describe("recordToRow — column positions", () => {
  it("col 0: row number 1-based", () => {
    expect(recordToRow(SAMPLE_RECORD, 0)[0]).toBe(1);
    expect(recordToRow(SAMPLE_RECORD, 4)[0]).toBe(5);
    expect(recordToRow(SAMPLE_RECORD, 9)[0]).toBe(10);
  });

  it("col 1: tanggalPemeriksaan", () => {
    expect(recordToRow(SAMPLE_RECORD, 0)[1]).toBe(SAMPLE_RECORD.tanggalPemeriksaan);
  });

  it("cols 2-13: identitas fields in order", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[2]).toBe(SAMPLE_RECORD.nik);
    expect(row[3]).toBe(SAMPLE_RECORD.namaPasien);
    expect(row[4]).toBe(SAMPLE_RECORD.tanggalLahir);
    expect(row[5]).toBe(SAMPLE_RECORD.jenisKelamin);
    expect(row[6]).toBe(SAMPLE_RECORD.provinsiAsal);
    expect(row[7]).toBe(SAMPLE_RECORD.kotaKabupatenAsal);
    expect(row[8]).toBe(SAMPLE_RECORD.alamat);
    expect(row[9]).toBe(SAMPLE_RECORD.noTelpHp);
    expect(row[10]).toBe(SAMPLE_RECORD.statusPendidikan);
    expect(row[11]).toBe(SAMPLE_RECORD.pekerjaan);
    expect(row[12]).toBe(SAMPLE_RECORD.statusPerkawinan);
    expect(row[13]).toBe(SAMPLE_RECORD.golonganDarah);
  });

  it("cols 14-19: riwayat keluarga + diri", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[14]).toBe(SAMPLE_RECORD.riwayatKeluarga1);
    expect(row[15]).toBe(SAMPLE_RECORD.riwayatKeluarga2);
    expect(row[16]).toBe(SAMPLE_RECORD.riwayatKeluarga3);
    expect(row[17]).toBe(SAMPLE_RECORD.riwayatDiri1);
    expect(row[18]).toBe(SAMPLE_RECORD.riwayatDiri2);
    expect(row[19]).toBe(SAMPLE_RECORD.riwayatDiri3);
  });

  it("cols 20-26: faktor risiko (merokok, aktivitas, 4x pola makan, alkohol)", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[20]).toBe(SAMPLE_RECORD.merokok);
    expect(row[21]).toBe(SAMPLE_RECORD.kurangAktivitasFisik);
    expect(row[22]).toBe(SAMPLE_RECORD.gulaBeberlebihan);
    expect(row[23]).toBe(SAMPLE_RECORD.garamBerlebihan);
    expect(row[24]).toBe(SAMPLE_RECORD.lemakBerlebihan);
    expect(row[25]).toBe(SAMPLE_RECORD.kurangMakanBuahSayur);
    expect(row[26]).toBe(SAMPLE_RECORD.konsumsiAlkohol);
  });

  it("cols 27-28: sistol, diastol", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[27]).toBe(SAMPLE_RECORD.sistol);
    expect(row[28]).toBe(SAMPLE_RECORD.diastol);
  });

  it("cols 29-30: tinggi badan, berat badan (IMT section)", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[29]).toBe(SAMPLE_RECORD.tinggiBadan);
    expect(row[30]).toBe(SAMPLE_RECORD.beratBadan);
  });

  it("cols 31-33: lingkar perut, gula darah, rujuk RS", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[31]).toBe(SAMPLE_RECORD.lingkarPerut);
    expect(row[32]).toBe(SAMPLE_RECORD.pemeriksaanGulaDarah);
    expect(row[33]).toBe(SAMPLE_RECORD.rujukRs);
  });

  it("cols 34-38: diagnosis 1-3, terapi, konseling", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[34]).toBe(SAMPLE_RECORD.diagnosis1);
    expect(row[35]).toBe(SAMPLE_RECORD.diagnosis2);
    expect(row[36]).toBe(SAMPLE_RECORD.diagnosis3);
    expect(row[37]).toBe(SAMPLE_RECORD.terapiFarmakologi);
    expect(row[38]).toBe(SAMPLE_RECORD.konseling);
  });

  it("cols 39-41: katarak (kanan, kiri, rujuk RS)", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[39]).toBe(SAMPLE_RECORD.katarakMataKanan);
    expect(row[40]).toBe(SAMPLE_RECORD.katarakMataKiri);
    expect(row[41]).toBe(SAMPLE_RECORD.katarakRujukRS);
  });

  it("cols 42-44: kelainan refraksi (kanan, kiri, rujuk RS)", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[42]).toBe(SAMPLE_RECORD.kelainanRefraksiMataKanan);
    expect(row[43]).toBe(SAMPLE_RECORD.kelainanRefraksiMataKiri);
    expect(row[44]).toBe(SAMPLE_RECORD.kelainanRefraksiRujukRS);
  });

  it("cols 45-47: tuli kongenital (kanan, kiri, rujuk RS)", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[45]).toBe(SAMPLE_RECORD.tuliKongenitalTelingaKanan);
    expect(row[46]).toBe(SAMPLE_RECORD.tuliKongenitalTelingaKiri);
    expect(row[47]).toBe(SAMPLE_RECORD.tuliKongenitalRujukRS);
  });

  it("cols 48-50: OMSK (kanan, kiri, rujuk RS)", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[48]).toBe(SAMPLE_RECORD.omskTelingaKanan);
    expect(row[49]).toBe(SAMPLE_RECORD.omskTelingaKiri);
    expect(row[50]).toBe(SAMPLE_RECORD.omskRujukRS);
  });

  it("cols 51-53: serumen (kanan, kiri, rujuk RS)", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[51]).toBe(SAMPLE_RECORD.serumenTelingaKanan);
    expect(row[52]).toBe(SAMPLE_RECORD.serumenTelingaKiri);
    expect(row[53]).toBe(SAMPLE_RECORD.serumenRujukRS);
  });

  it("cols 54-57: IVA & SADANIS (hasil IVA, TL IVA, hasil SADANIS, TL SADANIS)", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[54]).toBe(SAMPLE_RECORD.hasilIva);
    expect(row[55]).toBe(SAMPLE_RECORD.tindakLanjutIvaPositif);
    expect(row[56]).toBe(SAMPLE_RECORD.hasilSadanis);
    expect(row[57]).toBe(SAMPLE_RECORD.tindakLanjutSadanis);
  });

  it("cols 58-61: UBM (konseling, CAR, rujuk UBM, kondisi)", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row[58]).toBe(SAMPLE_RECORD.konselingUbm);
    expect(row[59]).toBe(SAMPLE_RECORD.car);
    expect(row[60]).toBe(SAMPLE_RECORD.rujukUbm);
    expect(row[61]).toBe(SAMPLE_RECORD.kondisiUbm);
  });

  it("imt is NOT in exported row (computed only)", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row).not.toContain(SAMPLE_RECORD.imt);
  });

  it("usia is NOT in exported row (computed only)", () => {
    const row = recordToRow(SAMPLE_RECORD, 0);
    expect(row).not.toContain(SAMPLE_RECORD.usia);
  });
});

// ---------------------------------------------------------------------------
// TDD: COL_COLORS — exact fktpmar26 template colors
// ---------------------------------------------------------------------------

describe("COL_COLORS — exact fktpmar26 template colors", () => {
  it("col 1 (tanggal pemeriksaan): dark blue 2F5597", () => {
    expect(COL_COLORS[1]).toBe("2F5597");
  });

  it("cols 2-13 (identitas): green 70AD46", () => {
    for (let c = 2; c <= 13; c++) {
      expect(COL_COLORS[c]).toBe("70AD46");
    }
  });

  it("cols 14-19 (riwayat keluarga + diri): dark orange C55911", () => {
    for (let c = 14; c <= 19; c++) {
      expect(COL_COLORS[c]).toBe("C55911");
    }
  });

  it("cols 20-26 (faktor risiko): gold BF8F00", () => {
    for (let c = 20; c <= 26; c++) {
      expect(COL_COLORS[c]).toBe("BF8F00");
    }
  });

  it("cols 27-28 (tekanan darah): salmon F4B083", () => {
    expect(COL_COLORS[27]).toBe("F4B083");
    expect(COL_COLORS[28]).toBe("F4B083");
  });

  it("cols 29-30 (IMT: TB + BB): bright blue 00B0F0", () => {
    expect(COL_COLORS[29]).toBe("00B0F0");
    expect(COL_COLORS[30]).toBe("00B0F0");
  });

  it("cols 31-33 (LP + GDS + Rujuk RS): dark green 385623", () => {
    expect(COL_COLORS[31]).toBe("385623");
    expect(COL_COLORS[32]).toBe("385623");
    expect(COL_COLORS[33]).toBe("385623");
  });

  it("cols 34-38 (diagnosis + terapi + konseling): bright green 00B050", () => {
    for (let c = 34; c <= 38; c++) {
      expect(COL_COLORS[c]).toBe("00B050");
    }
  });

  it("cols 39-53 (gangguan indera): dark blue 2F5597", () => {
    for (let c = 39; c <= 53; c++) {
      expect(COL_COLORS[c]).toBe("2F5597");
    }
  });

  it("cols 54-57 (IVA & SADANIS): orange ED7B30", () => {
    for (let c = 54; c <= 57; c++) {
      expect(COL_COLORS[c]).toBe("ED7B30");
    }
  });

  it("cols 58-61 (UBM): gold BF8F00", () => {
    for (let c = 58; c <= 61; c++) {
      expect(COL_COLORS[c]).toBe("BF8F00");
    }
  });

  it("COL_COLORS covers all 62 columns (0-61)", () => {
    for (let c = 0; c <= 61; c++) {
      expect(COL_COLORS).toHaveProperty(String(c));
    }
  });
});

// ---------------------------------------------------------------------------
// recordToPreview
// ---------------------------------------------------------------------------

describe("recordToPreview", () => {
  it("returns an array of label/value pairs", () => {
    const preview = recordToPreview(SAMPLE_RECORD);
    expect(Array.isArray(preview)).toBe(true);
    expect(preview.length).toBeGreaterThan(0);
    for (const item of preview) {
      expect(item).toHaveProperty("label");
      expect(item).toHaveProperty("value");
    }
  });

  it("includes all critical identity fields", () => {
    const preview = recordToPreview(SAMPLE_RECORD);
    const labels = preview.map((p) => p.label);
    expect(labels).toContain("NIK");
    expect(labels).toContain("Nama Pasien");
    expect(labels).toContain("Jenis Kelamin");
    expect(labels).toContain("Tanggal Lahir");
    expect(labels).toContain("Alamat");
  });

  it("includes all pemeriksaan fisik fields", () => {
    const preview = recordToPreview(SAMPLE_RECORD);
    const labels = preview.map((p) => p.label);
    expect(labels).toContain("Sistol");
    expect(labels).toContain("Diastol");
    expect(labels).toContain("Tinggi Badan (cm)");
    expect(labels).toContain("Berat Badan (kg)");
    expect(labels).toContain("Lingkar Perut (cm)");
    expect(labels).toContain("Gula Darah");
  });

  it("includes diagnosis and therapy fields", () => {
    const preview = recordToPreview(SAMPLE_RECORD);
    const labels = preview.map((p) => p.label);
    expect(labels).toContain("Diagnosis 1");
    expect(labels).toContain("Diagnosis 2");
    expect(labels).toContain("Diagnosis 3");
    expect(labels).toContain("Terapi Farmakologi");
  });

  it("includes gangguan indera and IVA fields", () => {
    const preview = recordToPreview(SAMPLE_RECORD);
    const labels = preview.map((p) => p.label);
    expect(labels).toContain("Katarak (Mata Kanan)");
    expect(labels).toContain("Hasil IVA");
    expect(labels).toContain("Hasil SADANIS");
  });

  it("returns correct values from sample record", () => {
    const preview = recordToPreview(SAMPLE_RECORD);
    const byLabel = Object.fromEntries(preview.map((p) => [p.label, p.value]));

    expect(byLabel["NIK"]).toBe("6309064508970003");
    expect(byLabel["Nama Pasien"]).toBe("IRMA AGUSTINA");
    expect(byLabel["Jenis Kelamin"]).toBe("Perempuan");
    expect(byLabel["Sistol"]).toBe(125);
    expect(byLabel["Diastol"]).toBe(88);
    expect(byLabel["Tinggi Badan (cm)"]).toBe(153);
    expect(byLabel["Berat Badan (kg)"]).toBe(84);
    expect(byLabel["Gula Darah"]).toBe(117);
    expect(byLabel["Diagnosis 1"]).toBe("Obesitas");
    expect(byLabel["Diagnosis 2"]).toBe("Hipertensi Grade I");
  });

  it("handles empty string values gracefully", () => {
    const preview = recordToPreview(SAMPLE_RECORD);
    const byLabel = Object.fromEntries(preview.map((p) => [p.label, p.value]));
    expect(byLabel["Diagnosis 3"]).toBe("");
    expect(byLabel["Tindak Lanjut IVA Positif"]).toBe("");
  });

  it("produces deterministic output (same input → same output)", () => {
    const a = recordToPreview(SAMPLE_RECORD);
    const b = recordToPreview({ ...SAMPLE_RECORD });
    expect(a).toEqual(b);
  });

  it("handles a second record correctly", () => {
    const preview = recordToPreview(SAMPLE_RECORD_2);
    const byLabel = Object.fromEntries(preview.map((p) => [p.label, p.value]));
    expect(byLabel["NIK"]).toBe("6309032703760003");
    expect(byLabel["Nama Pasien"]).toBe("ZUKRI");
    expect(byLabel["Jenis Kelamin"]).toBe("Laki-laki");
    expect(byLabel["Sistol"]).toBe(130);
    expect(byLabel["Diagnosis 1"]).toBe("Hipertensi Grade I");
  });
});

// ---------------------------------------------------------------------------
// exportToExcel — mock ExcelJS + DOM so test doesn't produce an actual file
// ---------------------------------------------------------------------------

describe("exportToExcel — integration (mocked I/O)", () => {
  beforeEach(() => {
    // Mock fetch so template file is not actually requested
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    }));

    // Mock ExcelJS Workbook so no real file is written
    vi.mock("exceljs", () => {
      const mockWriteBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(8));
      const mockCell = { fill: null, font: null, alignment: null, border: null };
      const mockAddRow = vi.fn().mockReturnValue({
        height: 0,
        eachCell: vi.fn((_opts: unknown, cb: (cell: typeof mockCell, colNum: number) => void) => {
          for (let c = 1; c <= 62; c++) cb(mockCell, c);
        }),
      });
      const mockWorksheet = {
        rowCount: 5,
        columns: [],
        views: [],
        addRow: mockAddRow,
        spliceRows: vi.fn(),
      };
      const MockWorkbook = vi.fn().mockImplementation(() => ({
        addWorksheet: vi.fn().mockReturnValue(mockWorksheet),
        worksheets: [mockWorksheet],
        xlsx: { load: vi.fn().mockResolvedValue(undefined), writeBuffer: mockWriteBuffer },
      }));
      return { default: { Workbook: MockWorkbook } };
    });

    // Mock browser APIs used for download
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn().mockReturnValue("blob:mock"),
      revokeObjectURL: vi.fn(),
    });
    const mockAnchor = {
      href: "",
      download: "",
      click: vi.fn(),
    };
    vi.spyOn(document, "createElement").mockReturnValue(mockAnchor as unknown as HTMLElement);
    vi.spyOn(document.body, "appendChild").mockImplementation((n) => n);
    vi.spyOn(document.body, "removeChild").mockImplementation((n) => n);
  });

  it("resolves without throwing for a single record", async () => {
    const { exportToExcel } = await import("./exporter");
    await expect(exportToExcel([SAMPLE_RECORD], "test.xlsx")).resolves.toBeUndefined();
  });

  it("resolves without throwing for multiple records", async () => {
    const { exportToExcel } = await import("./exporter");
    await expect(
      exportToExcel([SAMPLE_RECORD, SAMPLE_RECORD_2], "multi.xlsx")
    ).resolves.toBeUndefined();
  });

  it("resolves without throwing for empty records", async () => {
    const { exportToExcel } = await import("./exporter");
    await expect(exportToExcel([], "empty.xlsx")).resolves.toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Type safety tests — PatientRecord shape
// ---------------------------------------------------------------------------

describe("PatientRecord type integrity", () => {
  it("all required fields are present in SAMPLE_RECORD", () => {
    const r: PatientRecord = SAMPLE_RECORD;

    expect(typeof r.id).toBe("string");
    expect(typeof r.nik).toBe("string");
    expect(typeof r.namaPasien).toBe("string");

    const numericFields: Array<keyof PatientRecord> = [
      "sistol", "diastol", "tinggiBadan", "beratBadan",
      "lingkarPerut", "imt", "pemeriksaanGulaDarah", "usia",
    ];
    for (const f of numericFields) {
      expect(["string", "number"]).toContain(typeof r[f]);
    }

    expect(typeof r.merokok).toBe("string");
    expect(typeof r.diagnosis1).toBe("string");
    expect(typeof r.terapiFarmakologi).toBe("string");
  });

  it("new template fields are present", () => {
    const r: PatientRecord = SAMPLE_RECORD;
    expect(typeof r.gulaBeberlebihan).toBe("string");
    expect(typeof r.garamBerlebihan).toBe("string");
    expect(typeof r.lemakBerlebihan).toBe("string");
    expect(typeof r.kurangMakanBuahSayur).toBe("string");
    expect(typeof r.rujukRs).toBe("string");
    expect(typeof r.konseling).toBe("string");
    expect(typeof r.katarakMataKanan).toBe("string");
    expect(typeof r.katarakMataKiri).toBe("string");
    expect(typeof r.katarakRujukRS).toBe("string");
    expect(typeof r.tindakLanjutIvaPositif).toBe("string");
    expect(typeof r.tindakLanjutSadanis).toBe("string");
    expect(typeof r.kondisiUbm).toBe("string");
  });
});
