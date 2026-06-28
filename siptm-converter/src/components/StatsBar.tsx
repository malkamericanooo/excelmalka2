import { PatientRecord } from "@/lib/types";
import { Users, Heart, Activity, AlertTriangle } from "lucide-react";

interface StatsBarProps {
  records: PatientRecord[];
}

export function StatsBar({ records }: StatsBarProps) {
  const total = records.length;
  const perempuan = records.filter((r) =>
    String(r.jenisKelamin).toLowerCase().includes("perempuan") || String(r.jenisKelamin).toLowerCase() === "p"
  ).length;
  const lakiLaki = total - perempuan;

  const hipertensi = records.filter((r) => {
    const s = Number(r.sistol);
    const d = Number(r.diastol);
    return (!isNaN(s) && s >= 140) || (!isNaN(d) && d >= 90);
  }).length;

  const obesitas = records.filter((r) => {
    const imt = Number(r.imt);
    return !isNaN(imt) && imt >= 27;
  }).length;

  const gulaTinggi = records.filter((r) => {
    const g = Number(r.pemeriksaanGulaDarah);
    return !isNaN(g) && g >= 200;
  }).length;

  const stats = [
    { label: "Total Pasien", value: total, icon: <Users className="h-5 w-5" />, color: "blue", sub: `${lakiLaki}L / ${perempuan}P` },
    { label: "Hipertensi", value: hipertensi, icon: <Heart className="h-5 w-5" />, color: "red", sub: `${total ? Math.round((hipertensi / total) * 100) : 0}%` },
    { label: "Obesitas (IMT≥27)", value: obesitas, icon: <Activity className="h-5 w-5" />, color: "orange", sub: `${total ? Math.round((obesitas / total) * 100) : 0}%` },
    { label: "Gula Tinggi (≥200)", value: gulaTinggi, icon: <AlertTriangle className="h-5 w-5" />, color: "yellow", sub: `${total ? Math.round((gulaTinggi / total) * 100) : 0}%` },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    red: "bg-red-50 text-red-700 border-red-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
  };

  const iconColorMap: Record<string, string> = {
    blue: "text-blue-500",
    red: "text-red-500",
    orange: "text-orange-500",
    yellow: "text-yellow-500",
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`flex flex-col gap-1 rounded-xl border p-4 ${colorMap[s.color]}`}
        >
          <div className={`${iconColorMap[s.color]}`}>{s.icon}</div>
          <div className="text-2xl font-bold">{s.value}</div>
          <div className="text-xs font-medium leading-tight">{s.label}</div>
          <div className="text-xs opacity-70">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
