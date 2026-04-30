
import React from 'react';
import { StudentRecord } from '../types';
import { GrowthStatus } from "../types";

interface StudentTableProps {
  students: StudentRecord[];
}

const StudentTable: React.FC<StudentTableProps> = ({ students }) => {
  if (students.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl text-center shadow-sm border border-slate-200">
        <p className="text-slate-500 font-medium">No students found in this subgroup.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">ELL</th>
              <th className="px-6 py-4">ESE</th>
              <th className="px-6 py-4 text-center">Absences</th>
              <th className="px-6 py-4 text-center">PM1 Level</th>
              <th className="px-6 py-4 text-center">PM2 Level</th>
              <th className="px-6 py-4 text-center">Growth</th>
              <th className="px-6 py-4">Indicator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{s.name}</td>
                <td className="px-6 py-4">
                  {s.ell ? (
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{s.ell}</span>
                  ) : "-"}
                </td>
                <td className="px-6 py-4">
                   {s.ese ? (
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-bold">{s.ese}</span>
                  ) : "-"}
                </td>
                <td className="px-6 py-4 text-center">{s.absences}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getLevelColor(s.fastPm1Level)}`}>
                    {s.fastPm1Level || '?'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getLevelColor(s.fastPm2Level)}`}>
                    {s.fastPm2Level || '?'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <GrowthBadge status={s.growthStatus} />
                </td>
                <td className="px-6 py-4">
                  {s.l25l35Indicator ? (
                    <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-bold">{s.l25l35Indicator}</span>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
        Showing {students.length} students
      </div>
    </div>
  );
};

const getLevelColor = (level: any): string => {
  const l = Number(level);
  if (l >= 4) return "bg-emerald-100 text-emerald-700";
  if (l === 3) return "bg-blue-100 text-blue-700";
  if (l === 2) return "bg-yellow-100 text-yellow-700";
  if (l === 1) return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
};

const GrowthBadge: React.FC<{ status: GrowthStatus }> = ({ status }) => {
  const styles: Record<string, string> = {
    Improved: "bg-emerald-100 text-emerald-700",
    Maintained: "bg-slate-100 text-slate-700",
    Regressed: "bg-red-100 text-red-700",
    "Insufficient Data": "bg-slate-50 text-slate-400",
  };

  const icons: Record<string, string> = {
    Improved: "⬆",
    Maintained: "➖",
    Regressed: "⬇",
    "Insufficient Data": "—",
  };

  return (
    <span
  title={
    status === "Improved"
      ? "PM2 level higher than PM1"
      : status === "Maintained"
      ? "PM1 and PM2 levels are the same"
      : status === "Regressed"
      ? "PM2 level lower than PM1"
      : "Missing PM1 or PM2 data"
  }

      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
        styles[status] ?? ""
      }`}
    >
      {icons[status]} {status}
    </span>
  );
};

export default StudentTable;
