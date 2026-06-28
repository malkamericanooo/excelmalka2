import { PatientRecord } from "./types";

/**
 * HARDCODED COLUMN POSITIONS for "FORM OFFLINE SURVEILAN SIPTM" (File 1).
 * Since File 1's structure is always fixed (same columns, only data changes),
 * we can map by exact 0-based column index instead of fuzzy header matching.
 *
 * File 1 (98 cols) → File 2 / PatientRecord field mapping:
 *
 * F1-Col  Header (File 1)                         → PatientRecord field
 * ──────  ──────────────────────────────────────  ─────────────────────────────
 *  0      (no urut / kosong)                       — skipped
 *  1      Tanggal Pemeriksaan                     → tanggalPemeriksaan
 *  2      NIK                                      → nik
 *  3      Nama Pasien                              → namaPasien
 *  4      Tanggal Lahir                            → tanggalLahir
 *  5      Jenis Kelamin                            → jenisKelamin
 *  6      Provinsi Asal Pasien                    → provinsiAsal
 *  7      Kota/Kabupaten Asal Pasien              → kotaKabupatenAsal
 *  8      Alamat                                   → alamat
 *  9      No. Telp/HP                              → noTelpHp
 * 10      Status Pendidikan                       → statusPendidikan
 * 11      Pekerjaan                                → pekerjaan
 * 12      Status Perkawinan                       → statusPerkawinan
 * 13      Golongan Darah                           → golonganDarah
 * 14      Riwayat Keluarga 1                      → riwayatKeluarga1
 * 15      Riwayat Keluarga 2                      → riwayatKeluarga2
 * 16      Riwayat Keluarga 3                      → riwayatKeluarga3
 * 17      Riwayat Diri Sendiri 1                  → riwayatDiri1
 * 18      Riwayat Diri Sendiri 2                  → riwayatDiri2
 * 19      Riwayat Diri Sendiri 3                  → riwayatDiri3
 * 20      Merokok                                  → merokok
 * 21      Kurang Aktivitas Fisik                  → kurangAktivitasFisik
 * 22      Gula Berlebihan  (sub Pola Makan)       → gulaBeberlebihan
 * 23      Garam Berlebihan (sub Pola Makan)       → garamBerlebihan
 * 24      Lemak Berlebihan (sub Pola Makan)       → lemakBerlebihan
 * 25      Kurang Makan Buah dan Sayur             → kurangMakanBuahSayur
 * 26      Konsumsi Alkohol                        → konsumsiAlkohol
 * 27      Sistol                                   → sistol
 * 28      Diastol                                  → diastol
 * 29      Tinggi Badan (cm)                        → tinggiBadan
 * 30      Berat Badan (kg)                         → beratBadan
 * 31      Lingkar Perut (cm)                       → lingkarPerut
 * 32      Pemeriksaan Gula                        → pemeriksaanGulaDarah
 * 33      Rujuk RS                                 → rujukRs
 * 34      Diagnosis 1                              → diagnosis1
 * 35      Diagnosis 2                              → diagnosis2
 * 36      Diagnosis 3                              → diagnosis3
 * 37      Terapi Farmakologi                      → terapiFarmakologi
 * 38      Konseling / KIE                         → konseling
 * 39      Katarak – Mata Kanan                    → katarakMataKanan
 * 40      Katarak – Mata Kiri                     → katarakMataKiri
 * 41      Katarak – Rujuk RS                      → katarakRujukRS
 * 42      Kelainan Refraksi – Mata Kanan          → kelainanRefraksiMataKanan
 * 43      Kelainan Refraksi – Mata Kiri           → kelainanRefraksiMataKiri
 * 44      Kelainan Refraksi – Rujuk RS            → kelainanRefraksiRujukRS
 * 45      Curiga Tuli Kongenital – Telinga Kanan  → tuliKongenitalTelingaKanan
 * 46      Curiga Tuli Kongenital – Telinga Kiri   → tuliKongenitalTelingaKiri
 * 47      Curiga Tuli Kongenital – Rujuk RS       → tuliKongenitalRujukRS
 * 48      OMSK/Congek – Telinga Kanan             → omskTelingaKanan
 * 49      OMSK/Congek – Telinga Kiri              → omskTelingaKiri
 * 50      OMSK/Congek – Rujuk RS                  → omskRujukRS
 * 51      Serumen – Telinga Kanan                 → serumenTelingaKanan
 * 52      Serumen – Telinga Kiri                  → serumenTelingaKiri
 * 53      Serumen – Rujuk RS                      → serumenRujukRS
 * 54      Hasil IVA                               → hasilIva
 * 55      Tindak Lanjut IVA Positif               → tindakLanjutIvaPositif
 * 56      Hasil SADANIS                           → hasilSadanis
 * 57      Tindak Lanjut SADANIS                   → tindakLanjutSadanis
 * 58      Konseling UBM                           → konselingUbm
 * 59      CAR                                      → car
 * 60      Rujuk UBM                               → rujukUbm
 * 61      Kondisi                                  → kondisiUbm
 * 62+     Skrining Organ, Profil Lipid, Usia,     → DROPPED (not in File 2 template)
 *          Kriteria Usia, Skor PUMA, dll.
 */
const FORM_OFFLINE_POSITION_MAP: Array<[keyof Omit<PatientRecord, "id" | "imt" | "usia">, number]> = [
  ["tanggalPemeriksaan",          1],
  ["nik",                          2],
  ["namaPasien",                   3],
  ["tanggalLahir",                 4],
  ["jenisKelamin",                 5],
  ["provinsiAsal",                 6],
  ["kotaKabupatenAsal",            7],
  ["alamat",                       8],
  ["noTelpHp",                     9],
  ["statusPendidikan",            10],
  ["pekerjaan",                   11],
  ["statusPerkawinan",            12],
  ["golonganDarah",               13],
  ["riwayatKeluarga1",            14],
  ["riwayatKeluarga2",            15],
  ["riwayatKeluarga3",            16],
  ["riwayatDiri1",                17],
  ["riwayatDiri2",                18],
  ["riwayatDiri3",                19],
  ["merokok",                     20],
  ["kurangAktivitasFisik",        21],
  ["gulaBeberlebihan",            22],
  ["garamBerlebihan",             23],
  ["lemakBerlebihan",             24],
  ["kurangMakanBuahSayur",        25],
  ["konsumsiAlkohol",             26],
  ["sistol",                      27],
  ["diastol",                     28],
  ["tinggiBadan",                 29],
  ["beratBadan",                  30],
  ["lingkarPerut",                31],
  ["pemeriksaanGulaDarah",        32],
  ["rujukRs",                     33],
  ["diagnosis1",                  34],
  ["diagnosis2",                  35],
  ["diagnosis3",                  36],
  ["terapiFarmakologi",           37],
  ["konseling",                   38],
  ["katarakMataKanan",            39],
  ["katarakMataKiri",             40],
  ["katarakRujukRS",              41],
  ["kelainanRefraksiMataKanan",   42],
  ["kelainanRefraksiMataKiri",    43],
  ["kelainanRefraksiRujukRS",     44],
  ["tuliKongenitalTelingaKanan",  45],
  ["tuliKongenitalTelingaKiri",   46],
  ["tuliKongenitalRujukRS",       47],
  ["omskTelingaKanan",            48],
  ["omskTelingaKiri",             49],
  ["omskRujukRS",                 50],
  ["serumenTelingaKanan",         51],
  ["serumenTelingaKiri",          52],
  ["serumenRujukRS",              53],
  ["hasilIva",                    54],
  ["tindakLanjutIvaPositif",      55],
  ["hasilSadanis",                56],
  ["tindakLanjutSadanis",         57],
  ["konselingUbm",                58],
  ["car",                         59],
  ["rujukUbm",                    60],
  ["kondisiUbm",                  61],
];

/**
 * Fuzzy header-name aliases used as FALLBACK when the sheet name doesn't match
 * FORM OFFLINE exactly (e.g., renamed sheets or slightly different files).
 */
const HEADER_MAP: Record<keyof Omit<PatientRecord, "id">, string[]> = {
  tanggalPemeriksaan: ["tanggal pemeriksaan", "tgl pemeriksaan", "tanggal", "tgl", "tanggal periksa"],
  nik: ["nik", "no. nik", "nomor nik", "nik pasien"],
  namaPasien: ["nama pasien", "nama", "nama lengkap"],
  tanggalLahir: ["tanggal lahir", "tgl lahir", "ttl", "tanggal lahir pasien"],
  jenisKelamin: ["jenis kelamin", "gender", "sex", "l/p"],
  provinsiAsal: ["provinsi asal pasien", "provinsi asal", "provinsi"],
  kotaKabupatenAsal: ["kota/kabupaten asal pasien", "kota/kabupaten asal", "kota/kab asal", "kota kabupaten asal", "kab/kota"],
  alamat: ["alamat", "alamat pasien", "alamat lengkap"],
  noTelpHp: ["no. telp/hp", "no telp/hp", "no hp", "telepon", "nomor hp", "no. hp"],
  statusPendidikan: ["status pendidikan", "pendidikan", "tingkat pendidikan"],
  pekerjaan: ["pekerjaan", "jenis pekerjaan"],
  statusPerkawinan: ["status perkawinan", "perkawinan", "status kawin"],
  golonganDarah: ["golongan darah", "gol. darah", "gol darah"],
  usia: ["usia", "umur", "age"],
  riwayatKeluarga1: ["riwayat keluarga 1", "riwayat penyakit keluarga 1", "kel. riwayat 1"],
  riwayatKeluarga2: ["riwayat keluarga 2", "riwayat penyakit keluarga 2", "kel. riwayat 2"],
  riwayatKeluarga3: ["riwayat keluarga 3", "riwayat penyakit keluarga 3", "kel. riwayat 3"],
  riwayatDiri1: ["riwayat diri sendiri 1", "riwayat 1", "riwayat diri 1"],
  riwayatDiri2: ["riwayat diri sendiri 2", "riwayat 2", "riwayat diri 2"],
  riwayatDiri3: ["riwayat diri sendiri 3", "riwayat 3", "riwayat diri 3"],
  merokok: ["merokok", "kebiasaan merokok"],
  kurangAktivitasFisik: ["kurang aktivitas fisik", "kurang aktifitas fisik", "aktivitas fisik", "kurang ak. fisik"],
  gulaBeberlebihan: ["gula berlebihan", "konsumsi gula berlebihan", "pola makan"],
  garamBerlebihan: ["garam berlebihan", "konsumsi garam berlebihan"],
  lemakBerlebihan: ["lemak berlebihan", "konsumsi lemak berlebihan"],
  kurangMakanBuahSayur: ["kurang makan buah dan sayur", "kurang buah sayur", "buah sayur"],
  konsumsiAlkohol: ["konsumsi alkohol", "alkohol", "minum alkohol"],
  sistol: ["sistol", "sistole", "tekanan darah sistol", "td sistol", "systolic"],
  diastol: ["diastol", "diastole", "tekanan darah diastol", "td diastol", "diastolic"],
  tinggiBadan: ["tinggi badan", "tinggi badan(cm)", "tb", "tinggi", "height"],
  beratBadan: ["berat badan", "berat badan (kg)", "bb", "berat", "weight"],
  lingkarPerut: ["lingkar perut", "lp", "lingkar pinggang", "lingkar perut(cm)"],
  imt: ["imt", "bmi", "indeks massa tubuh"],
  pemeriksaanGulaDarah: ["pemeriksaan gula darah", "gula darah", "kadar gula darah", "gdp", "gds", "pemeriksaan gula"],
  rujukRs: ["rujuk rs", "rujuk ke rs", "rujukan rs", "rujuk rumah sakit"],
  diagnosis1: ["diagnosis 1", "diagnosa 1", "diagnosis pertama"],
  diagnosis2: ["diagnosis 2", "diagnosa 2", "diagnosis kedua"],
  diagnosis3: ["diagnosis 3", "diagnosa 3", "diagnosis ketiga"],
  terapiFarmakologi: ["terapi farmakologi", "terapi", "obat", "farmakologi"],
  konseling: ["konseling, informasi dan edukasi kesahatan", "konseling informasi edukasi", "kie", "konseling kie", "konseling kesehatan"],
  katarakMataKanan: ["katarak mata kanan", "katarak kanan", "katarak"],
  katarakMataKiri: ["katarak mata kiri", "katarak kiri"],
  katarakRujukRS: ["katarak rujuk rs", "katarak rujuk", "rujukan mata"],
  kelainanRefraksiMataKanan: ["kelainan refraksi mata kanan", "refraksi kanan", "kelainan refraksi"],
  kelainanRefraksiMataKiri: ["kelainan refraksi mata kiri", "refraksi kiri"],
  kelainanRefraksiRujukRS: ["kelainan refraksi rujuk rs", "refraksi rujuk"],
  tuliKongenitalTelingaKanan: ["tuli kongenital telinga kanan", "curiga tuli kongenital kanan", "tuli kongenital", "curiga tuli kongenital"],
  tuliKongenitalTelingaKiri: ["tuli kongenital telinga kiri", "curiga tuli kongenital kiri"],
  tuliKongenitalRujukRS: ["tuli kongenital rujuk rs", "tuli kongenital rujuk"],
  omskTelingaKanan: ["omsk telinga kanan", "omsk/congek kanan", "omsk", "otitis media"],
  omskTelingaKiri: ["omsk telinga kiri", "omsk/congek kiri"],
  omskRujukRS: ["omsk rujuk rs", "omsk rujuk"],
  serumenTelingaKanan: ["serumen telinga kanan", "serumen kanan", "serumen prop kanan", "serumen"],
  serumenTelingaKiri: ["serumen telinga kiri", "serumen kiri", "serumen prop kiri"],
  serumenRujukRS: ["serumen rujuk rs", "serumen rujuk"],
  hasilIva: ["hasil iva", "iva", "pemeriksaan iva"],
  tindakLanjutIvaPositif: ["tindak lanjut iva positif", "tindak lanjut iva", "tl iva", "follow up iva"],
  hasilSadanis: ["hasil sadanis", "sadanis", "pemeriksaan sadanis"],
  tindakLanjutSadanis: ["tindak lanjut sadanis", "tl sadanis"],
  konselingUbm: ["konseling ubm", "ubm konseling"],
  car: ["car", "carbon monoxide analyzer", "co analyzer"],
  rujukUbm: ["rujuk ubm", "ubm rujuk", "rujukan ubm"],
  kondisiUbm: ["kondisi ubm", "kondisi", "kondisi perokok"],
};

const FORM_OFFLINE_SHEET_NAME = "form offline surveilan siptm";

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function isFormOfflineSheet(sheetName: string): boolean {
  return normalize(sheetName).includes("form offline") || normalize(sheetName).includes("surveilan siptm");
}

function buildHeaderIndex(headers: string[]): Map<string, number> {
  const map = new Map<string, number>();
  headers.forEach((h, i) => {
    if (h !== undefined && h !== null) {
      map.set(normalize(String(h)), i);
    }
  });
  return map;
}

function resolveColumn(
  field: keyof typeof HEADER_MAP,
  headerIndex: Map<string, number>
): number | null {
  const candidates = HEADER_MAP[field];
  for (const c of candidates) {
    const idx = headerIndex.get(normalize(c));
    if (idx !== undefined) return idx;
  }
  for (const [key, idx] of headerIndex.entries()) {
    for (const c of candidates) {
      if (key.includes(normalize(c)) || normalize(c).includes(key)) {
        return idx;
      }
    }
  }
  return null;
}

function val(row: unknown[], idx: number | null): string {
  if (idx === null || idx >= row.length) return "";
  const v = row[idx];
  if (v === undefined || v === null) return "";
  return String(v).trim();
}

function numVal(row: unknown[], idx: number | null): string | number {
  const s = val(row, idx);
  if (s === "") return "";
  const n = Number(s.replace(/[^\d.-]/g, ""));
  return isNaN(n) ? s : n;
}

function computeImt(
  bb: string | number,
  tb: string | number,
  existing: string | number
): string | number {
  if (existing !== "") return existing;
  const w = Number(bb);
  const h = Number(tb);
  if (!isNaN(w) && !isNaN(h) && h > 0) {
    const hm = h / 100;
    return Math.round((w / (hm * hm)) * 10) / 10;
  }
  return "";
}

function buildRecordFromRow(row: unknown[], getIdx: (field: keyof Omit<PatientRecord, "id">) => number | null, rowIndex: number): PatientRecord {
  const bb = numVal(row, getIdx("beratBadan"));
  const tb = numVal(row, getIdx("tinggiBadan"));
  const existingImt = numVal(row, getIdx("imt"));

  return {
    id: `row-${rowIndex}`,
    tanggalPemeriksaan: val(row, getIdx("tanggalPemeriksaan")),
    nik:                val(row, getIdx("nik")),
    namaPasien:         val(row, getIdx("namaPasien")),
    tanggalLahir:       val(row, getIdx("tanggalLahir")),
    jenisKelamin:       val(row, getIdx("jenisKelamin")),
    provinsiAsal:       val(row, getIdx("provinsiAsal")),
    kotaKabupatenAsal:  val(row, getIdx("kotaKabupatenAsal")),
    alamat:             val(row, getIdx("alamat")),
    noTelpHp:           val(row, getIdx("noTelpHp")),
    statusPendidikan:   val(row, getIdx("statusPendidikan")),
    pekerjaan:          val(row, getIdx("pekerjaan")),
    statusPerkawinan:   val(row, getIdx("statusPerkawinan")),
    golonganDarah:      val(row, getIdx("golonganDarah")),
    usia:               numVal(row, getIdx("usia")),
    riwayatKeluarga1:   val(row, getIdx("riwayatKeluarga1")),
    riwayatKeluarga2:   val(row, getIdx("riwayatKeluarga2")),
    riwayatKeluarga3:   val(row, getIdx("riwayatKeluarga3")),
    riwayatDiri1:       val(row, getIdx("riwayatDiri1")),
    riwayatDiri2:       val(row, getIdx("riwayatDiri2")),
    riwayatDiri3:       val(row, getIdx("riwayatDiri3")),
    merokok:                    val(row, getIdx("merokok")),
    kurangAktivitasFisik:       val(row, getIdx("kurangAktivitasFisik")),
    gulaBeberlebihan:           val(row, getIdx("gulaBeberlebihan")),
    garamBerlebihan:            val(row, getIdx("garamBerlebihan")),
    lemakBerlebihan:            val(row, getIdx("lemakBerlebihan")),
    kurangMakanBuahSayur:       val(row, getIdx("kurangMakanBuahSayur")),
    konsumsiAlkohol:            val(row, getIdx("konsumsiAlkohol")),
    sistol:                     numVal(row, getIdx("sistol")),
    diastol:                    numVal(row, getIdx("diastol")),
    tinggiBadan:                tb,
    beratBadan:                 bb,
    imt:                        computeImt(bb, tb, existingImt),
    lingkarPerut:               numVal(row, getIdx("lingkarPerut")),
    pemeriksaanGulaDarah:       numVal(row, getIdx("pemeriksaanGulaDarah")),
    rujukRs:                    val(row, getIdx("rujukRs")),
    diagnosis1:                 val(row, getIdx("diagnosis1")),
    diagnosis2:                 val(row, getIdx("diagnosis2")),
    diagnosis3:                 val(row, getIdx("diagnosis3")),
    terapiFarmakologi:          val(row, getIdx("terapiFarmakologi")),
    konseling:                  val(row, getIdx("konseling")),
    katarakMataKanan:           val(row, getIdx("katarakMataKanan")),
    katarakMataKiri:            val(row, getIdx("katarakMataKiri")),
    katarakRujukRS:             val(row, getIdx("katarakRujukRS")),
    kelainanRefraksiMataKanan:  val(row, getIdx("kelainanRefraksiMataKanan")),
    kelainanRefraksiMataKiri:   val(row, getIdx("kelainanRefraksiMataKiri")),
    kelainanRefraksiRujukRS:    val(row, getIdx("kelainanRefraksiRujukRS")),
    tuliKongenitalTelingaKanan: val(row, getIdx("tuliKongenitalTelingaKanan")),
    tuliKongenitalTelingaKiri:  val(row, getIdx("tuliKongenitalTelingaKiri")),
    tuliKongenitalRujukRS:      val(row, getIdx("tuliKongenitalRujukRS")),
    omskTelingaKanan:           val(row, getIdx("omskTelingaKanan")),
    omskTelingaKiri:            val(row, getIdx("omskTelingaKiri")),
    omskRujukRS:                val(row, getIdx("omskRujukRS")),
    serumenTelingaKanan:        val(row, getIdx("serumenTelingaKanan")),
    serumenTelingaKiri:         val(row, getIdx("serumenTelingaKiri")),
    serumenRujukRS:             val(row, getIdx("serumenRujukRS")),
    hasilIva:                   val(row, getIdx("hasilIva")),
    tindakLanjutIvaPositif:     val(row, getIdx("tindakLanjutIvaPositif")),
    hasilSadanis:               val(row, getIdx("hasilSadanis")),
    tindakLanjutSadanis:        val(row, getIdx("tindakLanjutSadanis")),
    konselingUbm:               val(row, getIdx("konselingUbm")),
    car:                        val(row, getIdx("car")),
    rujukUbm:                   val(row, getIdx("rujukUbm")),
    kondisiUbm:                 val(row, getIdx("kondisiUbm")),
  };
}

export function parseExcelData(
  rawData: unknown[][],
  sheetName?: string
): { records: PatientRecord[]; headerRow: number } {
  if (!rawData || rawData.length === 0) return { records: [], headerRow: 0 };

  const usePositionMap = sheetName ? isFormOfflineSheet(sheetName) : false;

  if (usePositionMap) {
    // ── FAST PATH: position-based mapping for FORM OFFLINE SURVEILAN SIPTM ──
    // Skip first 5 header rows (rows 0-4), data starts at row 5.
    const DATA_START = 5;
    const posMap = new Map(FORM_OFFLINE_POSITION_MAP);

    const getIdx = (field: keyof Omit<PatientRecord, "id">): number | null => {
      if (field === "imt" || field === "usia") return null;
      return posMap.get(field as keyof Omit<PatientRecord, "id" | "imt" | "usia">) ?? null;
    };

    const records: PatientRecord[] = [];
    for (let i = DATA_START; i < rawData.length; i++) {
      const row = rawData[i] as unknown[];
      if (!row || row.every((c) => c === undefined || c === null || String(c).trim() === "")) continue;
      const record = buildRecordFromRow(row, getIdx, i);
      if (record.nik || record.namaPasien) records.push(record);
    }
    return { records, headerRow: DATA_START - 1 };
  }

  // ── FALLBACK PATH: fuzzy header-name matching ──
  let bestRow = 0;
  let bestScore = 0;
  const scanLimit = Math.min(8, rawData.length);

  for (let i = 0; i < scanLimit; i++) {
    const row = rawData[i] as unknown[];
    const score = row.filter(
      (c) => c !== undefined && c !== null && String(c).trim().length > 2
    ).length;
    if (score > bestScore) {
      bestScore = score;
      bestRow = i;
    }
  }

  const headerRow = rawData[bestRow] as string[];
  const headerIndex = buildHeaderIndex(headerRow);

  const colMap = {} as Record<keyof Omit<PatientRecord, "id">, number | null>;
  for (const field of Object.keys(HEADER_MAP) as Array<keyof typeof HEADER_MAP>) {
    colMap[field] = resolveColumn(field, headerIndex);
  }

  const getIdx = (field: keyof Omit<PatientRecord, "id">): number | null => colMap[field];

  const records: PatientRecord[] = [];
  for (let i = bestRow + 1; i < rawData.length; i++) {
    const row = rawData[i] as unknown[];
    if (!row || row.every((c) => c === undefined || c === null || String(c).trim() === "")) continue;
    const record = buildRecordFromRow(row, getIdx, i);
    if (record.nik || record.namaPasien) records.push(record);
  }

  return { records, headerRow: bestRow };
}

export { FORM_OFFLINE_SHEET_NAME };
