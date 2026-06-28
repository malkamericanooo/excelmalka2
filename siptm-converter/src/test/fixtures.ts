import { PatientRecord } from "@/lib/types";

// ---------------------------------------------------------------------------
// MINIMAL_RAW — 2-row header, 2 data rows, subset of columns
// ---------------------------------------------------------------------------
export const MINIMAL_RAW: unknown[][] = [
  ["IDENTITAS PASIEN", "", "", "", "", "PEMERIKSAAN FISIK", "", "", "", "", "GULA DARAH", "DIAGNOSIS", "", ""],
  [
    "NIK", "Nama Pasien", "Tanggal Lahir", "Jenis Kelamin", "Usia",
    "Sistol", "Diastol", "Tinggi Badan", "Berat Badan", "Lingkar Perut",
    "Pemeriksaan Gula Darah", "Diagnosis 1", "Diagnosis 2", "Diagnosis 3",
  ],
  [
    "6309064508970003", "IRMA AGUSTINA", "05-08-1997", "Perempuan", "28",
    "125", "88", "153", "84", "109",
    "117", "Hipertensi", "", "",
  ],
  [
    "6309032703760003", "ZUKRI", "27-03-1976", "Laki-laki", "50",
    "130", "90", "170", "71.8", "88",
    "95", "", "", "",
  ],
];

export const SINGLE_HEADER_RAW: unknown[][] = [
  [
    "NIK", "Nama Pasien", "Jenis Kelamin", "Usia",
    "Sistol", "Diastol", "Tinggi Badan", "Berat Badan",
  ],
  ["1234567890123456", "BUDI SANTOSO", "Laki-laki", "35", "120", "80", "170", "65"],
];

export const GARBAGE_TOP_RAW: unknown[][] = [
  ["", "", "", ""],
  ["LAPORAN SURVEILANS PTM", "", "", ""],
  ["Tanggal: 24-06-2026", "", "", ""],
  ["NIK", "Nama Pasien", "Jenis Kelamin", "Usia", "Sistol", "Diastol"],
  ["9999888877776666", "SITI RAHAYU", "Perempuan", "45", "140", "95"],
];

export const EMPTY_RAW: unknown[][] = [];

export const ALL_EMPTY_RAW: unknown[][] = [
  ["", "", ""],
  ["", "", ""],
];

// ---------------------------------------------------------------------------
// FORM_OFFLINE_RAW — simulates "FORM OFFLINE SURVEILAN SIPTM" exactly:
//   • 5 header rows  (rows 0–4, position-based mapping uses DATA_START = 5)
//   • 98 columns (A–CT), positions 0-61 match fktpmar26, 62+ are extras
//   • Sheet name triggers the hardcoded position-map path
//
// Column index → PatientRecord field (positions from FORM_OFFLINE_POSITION_MAP):
//  0  = no urut (skipped)
//  1  = tanggalPemeriksaan
//  2  = NIK
//  3  = namaPasien
//  4  = tanggalLahir
//  5  = jenisKelamin
//  6  = provinsiAsal
//  7  = kotaKabupatenAsal
//  8  = alamat
//  9  = noTelpHp
// 10  = statusPendidikan
// 11  = pekerjaan
// 12  = statusPerkawinan
// 13  = golonganDarah
// 14  = riwayatKeluarga1
// 15  = riwayatKeluarga2
// 16  = riwayatKeluarga3
// 17  = riwayatDiri1
// 18  = riwayatDiri2
// 19  = riwayatDiri3
// 20  = merokok
// 21  = kurangAktivitasFisik
// 22  = gulaBeberlebihan
// 23  = garamBerlebihan
// 24  = lemakBerlebihan
// 25  = kurangMakanBuahSayur
// 26  = konsumsiAlkohol
// 27  = sistol
// 28  = diastol
// 29  = tinggiBadan
// 30  = beratBadan
// 31  = lingkarPerut
// 32  = pemeriksaanGulaDarah
// 33  = rujukRs
// 34  = diagnosis1
// 35  = diagnosis2
// 36  = diagnosis3
// 37  = terapiFarmakologi
// 38  = konseling
// 39  = katarakMataKanan
// 40  = katarakMataKiri
// 41  = katarakRujukRS
// 42  = kelainanRefraksiMataKanan
// 43  = kelainanRefraksiMataKiri
// 44  = kelainanRefraksiRujukRS
// 45  = tuliKongenitalTelingaKanan
// 46  = tuliKongenitalTelingaKiri
// 47  = tuliKongenitalRujukRS
// 48  = omskTelingaKanan
// 49  = omskTelingaKiri
// 50  = omskRujukRS
// 51  = serumenTelingaKanan
// 52  = serumenTelingaKiri
// 53  = serumenRujukRS
// 54  = hasilIva
// 55  = tindakLanjutIvaPositif
// 56  = hasilSadanis
// 57  = tindakLanjutSadanis
// 58  = konselingUbm
// 59  = car
// 60  = rujukUbm
// 61  = kondisiUbm
// 62+ = extras (Skrining Organ, Profil Lipid, Usia, dst.) — DROPPED
// ---------------------------------------------------------------------------

function makeRow(overrides: Record<number, string | number> = {}): unknown[] {
  const row: unknown[] = Array(98).fill("");
  for (const [col, val] of Object.entries(overrides)) {
    row[Number(col)] = val;
  }
  return row;
}

const FO_HEADER_ROW0 = Array(98).fill("");
const FO_HEADER_ROW1: unknown[] = Array(98).fill("");
const FO_HEADER_ROW2: unknown[] = Array(98).fill("");
const FO_HEADER_ROW3: unknown[] = Array(98).fill("");
const FO_HEADER_ROW4: unknown[] = Array(98).fill("");

// Representative header labels (mirrors actual file)
Object.assign(FO_HEADER_ROW1, {
  1:  "TANGGAL PEMERIKSAAN*",
  2:  "IDENTITAS PESERTA PUSKESMAS",
  14: "RIWAYAT PENYAKIT TIDAK MENULAR PADA KELUARGA",
  17: "RIWAYAT PENYAKIT TIDAK MENULAR PADA DIRI SENDIRI",
  20: "FAKTOR RISIKO",
  27: "TEKANAN DARAH",
  29: "IMT",
  31: "LINGKAR PERUT(CM)",
  32: "PEMERIKSAAN GULA",
  33: "RUJUK RS",
  34: "DIAGNOSIS",
  37: "TERAPI FARMAKOLOGI",
  38: "KONSELING, INFORMASI DAN EDUKASI KESAHATAN",
  39: "GANGGUAN INDERA",
  54: "PEMERIKSAAN IVA & SADANIS",
  58: "FORM UBM",
});

Object.assign(FO_HEADER_ROW2, {
  1:  "TANGGAL PEMERIKSAAN",
  2:  "NIK", 3: "NAMA PASIEN*", 4: "TANGGAL LAHIR *", 5: "JENIS KELAMIN *",
  6:  "PROVINSI ASAL PASIEN", 7: "KOTA/KAB. ASAL PASIEN", 8: "ALAMAT*",
  9:  "NO.TELP/HP", 10: "STATUS PENDIDIKAN", 11: "PEKERJAAN",
  12: "STATUS PERKAWINAN", 13: "GOLONGAN DARAH",
  14: "RIWAYAT 1", 15: "RIWAYAT 2", 16: "RIWAYAT 3",
  17: "RIWAYAT 1", 18: "RIWAYAT 2", 19: "RIWAYAT 3",
  20: "MEROKOK", 21: "KURANG AKTIFITAS FISIK", 22: "POLA MAKAN",
  26: "KONSUMSI ALKOHOL", 27: "SISTOL", 28: "DIASTOL",
  29: "TINGGI BADAN(CM)", 30: "BERAT BADAN (KG)",
  34: "DIAGNOSIS 1", 35: "DIAGNOSIS 2", 36: "DIAGNOSIS 3",
  39: "GANGGUAN PENGLIHATAN", 45: "GANGGUAN PENDENGARAN",
  54: "PEMERIKSAAN IVA", 56: "PEMERIKSAAN SADANIS",
  58: "KONSELING", 59: "CAR", 60: "RUJUK UBM", 61: "KONDISI",
});

Object.assign(FO_HEADER_ROW3, {
  22: "GULA BERLEBIHAN", 23: "GARAM BERLEBIHAN",
  24: "LEMAK BERLEBIHAN", 25: "KURANG MAKAN BUAH DAN SAYUR",
  39: "KATARAK", 42: "KELAINAN REFRAKSI",
  45: "CURIGA TULI KONGENITAL", 48: "(OMSK/CONGEK)", 51: "SERUMEN",
  54: "HASIL IVA", 55: "TINDAK LANJUT IVA POSITIF",
  56: "HASIL SADANIS", 57: "TINDAK LANJUT SADANIS",
});

Object.assign(FO_HEADER_ROW4, {
  39: "MATA KANAN", 40: "MATA KIRI", 41: "RUJUK  RS",
  42: "MATA KANAN", 43: "MATA KIRI", 44: "RUJUK  RS",
  45: "TELINGA KANAN", 46: "TELINGA KIRI", 47: "RUJUK  RS",
  48: "TELINGA KANAN", 49: "TELINGA KIRI", 50: "RUJUK  RS",
  51: "TELINGA KANAN", 52: "TELINGA KIRI", 53: "RUJUK  RS",
});

export const FO_DATA_IRMA = makeRow({
  0:  1,
  1:  "24-06-2026",
  2:  "6309064508970003",
  3:  "IRMA AGUSTINA",
  4:  "05-08-1997",
  5:  "Perempuan",
  6:  "Kalimantan Selatan",
  7:  "Tabalong",
  8:  "JL. SIMPANG EMPAT OBOR",
  9:  "081234567890",
  10: "SMA",
  11: "IRT",
  12: "Kawin",
  13: "B",
  14: "Hipertensi",
  20: "Tidak",
  21: "Ya",
  22: "Ya",
  23: "Ya",
  24: "Tidak",
  25: "Ya",
  26: "Tidak",
  27: 125,
  28: 88,
  29: 153,
  30: 84,
  31: 109,
  32: 117,
  33: "Tidak",
  34: "Obesitas",
  35: "Hipertensi Grade I",
  36: "",
  37: "Amlodipin 5mg",
  38: "Aktivitas Fisik",
  39: "Negatif",
  40: "Negatif",
  41: "Tidak",
  42: "Negatif",
  43: "Negatif",
  44: "Tidak",
  45: "Negatif",
  46: "Negatif",
  47: "Tidak",
  48: "Negatif",
  49: "Negatif",
  50: "Tidak",
  51: "Negatif",
  52: "Negatif",
  53: "Tidak",
  54: "Normal",
  55: "",
  56: "Normal",
  57: "",
  58: "Tidak",
  59: "Tidak",
  60: "Tidak",
  61: "",
  // cols 62+ = extras (Skrining Organ, Profil Lipid, Usia, dst.) — ignored
  62: "Negatif", // Skrining Mata
  63: "Negatif", // Skrining Ginjal
  64: "Negatif", // Skrining Hati
  65: "Negatif", // Skrining Saraf & Otot
  66: "Negatif", // Skrining Kardiovaskular
  67: 180,       // Kolesterol Total
  68: 110,       // LDL
  69: 45,        // HDL
  70: 150,       // Trigliserida
  71: 28,        // Usia
  72: "≥40",     // Kriteria Usia
  73: 5,         // Skor PUMA
});

export const FO_DATA_ZUKRI = makeRow({
  0:  2,
  1:  "24-06-2026",
  2:  "6309032703760003",
  3:  "ZUKRI",
  4:  "27-03-1976",
  5:  "Laki-laki",
  6:  "Kalimantan Selatan",
  7:  "Tabalong",
  27: 130,
  28: 90,
  29: 170,
  30: 71.8,
  31: 88,
  32: 95,
  34: "Hipertensi Grade I",
});

/** Full FORM OFFLINE SURVEILAN SIPTM raw data (5 header rows + 2 data rows) */
export const FORM_OFFLINE_RAW: unknown[][] = [
  FO_HEADER_ROW0,
  FO_HEADER_ROW1,
  FO_HEADER_ROW2,
  FO_HEADER_ROW3,
  FO_HEADER_ROW4,
  FO_DATA_IRMA,
  FO_DATA_ZUKRI,
];

// ---------------------------------------------------------------------------
// SAMPLE_RECORD — single complete PatientRecord for exporter tests
// ---------------------------------------------------------------------------
export const SAMPLE_RECORD: PatientRecord = {
  id: "test-001",
  tanggalPemeriksaan: "24-06-2026",
  nik: "6309064508970003",
  namaPasien: "IRMA AGUSTINA",
  tanggalLahir: "05-08-1997",
  jenisKelamin: "Perempuan",
  provinsiAsal: "Kalimantan Selatan",
  kotaKabupatenAsal: "Tabalong",
  alamat: "JL. SIMPANG EMPAT OBOR",
  noTelpHp: "081234567890",
  statusPendidikan: "SMA",
  pekerjaan: "Ibu Rumah Tangga",
  statusPerkawinan: "Kawin",
  golonganDarah: "B",
  usia: 28,
  imt: 35.9,
  riwayatKeluarga1: "Hipertensi",
  riwayatKeluarga2: "",
  riwayatKeluarga3: "",
  riwayatDiri1: "",
  riwayatDiri2: "",
  riwayatDiri3: "",
  merokok: "TIDAK",
  kurangAktivitasFisik: "YA",
  gulaBeberlebihan: "YA",
  garamBerlebihan: "YA",
  lemakBerlebihan: "YA",
  kurangMakanBuahSayur: "YA",
  konsumsiAlkohol: "TIDAK",
  sistol: 125,
  diastol: 88,
  tinggiBadan: 153,
  beratBadan: 84,
  lingkarPerut: 109,
  pemeriksaanGulaDarah: 117,
  rujukRs: "TIDAK",
  diagnosis1: "Obesitas",
  diagnosis2: "Hipertensi Grade I",
  diagnosis3: "",
  terapiFarmakologi: "Amlodipin 5mg",
  konseling: "Aktifitas Fisik",
  katarakMataKanan: "TIDAK",
  katarakMataKiri: "TIDAK",
  katarakRujukRS: "TIDAK",
  kelainanRefraksiMataKanan: "TIDAK",
  kelainanRefraksiMataKiri: "TIDAK",
  kelainanRefraksiRujukRS: "TIDAK",
  tuliKongenitalTelingaKanan: "TIDAK",
  tuliKongenitalTelingaKiri: "TIDAK",
  tuliKongenitalRujukRS: "TIDAK",
  omskTelingaKanan: "TIDAK",
  omskTelingaKiri: "TIDAK",
  omskRujukRS: "TIDAK",
  serumenTelingaKanan: "TIDAK",
  serumenTelingaKiri: "TIDAK",
  serumenRujukRS: "TIDAK",
  hasilIva: "Negatif",
  tindakLanjutIvaPositif: "",
  hasilSadanis: "Normal",
  tindakLanjutSadanis: "",
  konselingUbm: "TIDAK",
  car: "TIDAK",
  rujukUbm: "TIDAK",
  kondisiUbm: "",
};

export const SAMPLE_RECORD_2: PatientRecord = {
  ...SAMPLE_RECORD,
  id: "test-002",
  nik: "6309032703760003",
  namaPasien: "ZUKRI",
  jenisKelamin: "Laki-laki",
  usia: 50,
  sistol: 130,
  diastol: 90,
  tinggiBadan: 170,
  beratBadan: 71.8,
  imt: 24.8,
  lingkarPerut: 88,
  diagnosis1: "Hipertensi Grade I",
  diagnosis2: "",
};
