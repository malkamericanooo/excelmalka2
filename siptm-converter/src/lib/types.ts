export interface PatientRecord {
  id: string;

  // Col 1: Tanggal Pemeriksaan
  tanggalPemeriksaan: string;

  // Cols 2-13: Identitas Peserta
  nik: string;
  namaPasien: string;
  tanggalLahir: string;
  jenisKelamin: string;
  provinsiAsal: string;
  kotaKabupatenAsal: string;
  alamat: string;
  noTelpHp: string;
  statusPendidikan: string;
  pekerjaan: string;
  statusPerkawinan: string;
  golonganDarah: string;

  // Cols 14-16: Riwayat Keluarga
  riwayatKeluarga1: string;
  riwayatKeluarga2: string;
  riwayatKeluarga3: string;

  // Cols 17-19: Riwayat Diri Sendiri
  riwayatDiri1: string;
  riwayatDiri2: string;
  riwayatDiri3: string;

  // Cols 20-26: Faktor Risiko
  merokok: string;
  kurangAktivitasFisik: string;
  gulaBeberlebihan: string;
  garamBerlebihan: string;
  lemakBerlebihan: string;
  kurangMakanBuahSayur: string;
  konsumsiAlkohol: string;

  // Cols 27-28: Tekanan Darah
  sistol: string | number;
  diastol: string | number;

  // Cols 29-30: IMT section (TB + BB)
  tinggiBadan: string | number;
  beratBadan: string | number;

  // Cols 31-33: Lingkar Perut, Gula, Rujuk RS
  lingkarPerut: string | number;
  pemeriksaanGulaDarah: string | number;
  rujukRs: string;

  // Cols 34-36: Diagnosis
  diagnosis1: string;
  diagnosis2: string;
  diagnosis3: string;

  // Col 37: Terapi Farmakologi
  terapiFarmakologi: string;

  // Col 38: Konseling, Informasi dan Edukasi Kesehatan
  konseling: string;

  // Cols 39-41: Gangguan Penglihatan - Katarak
  katarakMataKanan: string;
  katarakMataKiri: string;
  katarakRujukRS: string;

  // Cols 42-44: Gangguan Penglihatan - Kelainan Refraksi
  kelainanRefraksiMataKanan: string;
  kelainanRefraksiMataKiri: string;
  kelainanRefraksiRujukRS: string;

  // Cols 45-47: Gangguan Pendengaran - Tuli Kongenital
  tuliKongenitalTelingaKanan: string;
  tuliKongenitalTelingaKiri: string;
  tuliKongenitalRujukRS: string;

  // Cols 48-50: Gangguan Pendengaran - OMSK
  omskTelingaKanan: string;
  omskTelingaKiri: string;
  omskRujukRS: string;

  // Cols 51-53: Gangguan Pendengaran - Serumen
  serumenTelingaKanan: string;
  serumenTelingaKiri: string;
  serumenRujukRS: string;

  // Cols 54-57: IVA & SADANIS
  hasilIva: string;
  tindakLanjutIvaPositif: string;
  hasilSadanis: string;
  tindakLanjutSadanis: string;

  // Cols 58-61: Form UBM
  konselingUbm: string;
  car: string;
  rujukUbm: string;
  kondisiUbm: string;

  // Computed / display only — NOT exported as a template column
  imt: string | number;
  usia: string | number;
}

export type SortDirection = "asc" | "desc" | null;

export interface SortState {
  column: keyof PatientRecord | null;
  direction: SortDirection;
}
