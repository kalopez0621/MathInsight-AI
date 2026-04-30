import { StudentRecord, ParseResult, GrowthStatus } from "../types";

declare const XLSX: any;
declare const Papa: any;

/* ===============================
   Header Normalization
=============================== */
const normalizeHeader = (header: string): string =>
  header.toLowerCase().replace(/[^a-z0-9]/g, "");

/* ===============================
   Safe Value Helpers
=============================== */
const clean = (v: any): string =>
  v === undefined || v === null ? "" : String(v).trim();

const numOrString = (v: any): number | string => {
  const t = clean(v);
  if (t === "") return "";
  const n = Number(t);
  return isNaN(n) ? t : n;
};

/* ===============================
   FAST Level Normalizer
=============================== */
const parseFastLevel = (v: any): number | null => {
  if (!v) return null;
  const cleaned = String(v).replace(/level/i, "").trim();
  const n = Number(cleaned);
  return isNaN(n) ? null : n;
};

/* ===============================
   Proficiency Helper
=============================== */
type ProficiencyStatus =
  | "Proficient"
  | "Not Proficient"
  | "Not Assessed";

const getProficiencyStatus = (
  level: number | null
): ProficiencyStatus => {
  if (level === null) return "Not Assessed";
  if (level >= 3 && level <= 5) return "Proficient";
  if (level >= 1 && level <= 2) return "Not Proficient";
  return "Not Assessed";
};

/* ===============================
   Growth Helper
=============================== */
const getGrowthStatus = (
  pm1: number | null,
  pm2: number | null
): GrowthStatus => {
  if (pm1 === null || pm2 === null) return "Insufficient Data";
  if (pm2 > pm1) return "Improved";
  if (pm2 === pm1) return "Maintained";
  return "Regressed";
};

/* ===============================
   Anonymization Maps
=============================== */
const studentIdMap = new Map<string, string>();
let studentCounter = 1;

const teacherMap = new Map<string, string>();
let teacherCounter = 0;

const getAnonStudentId = (originalId: string): string => {
  if (!studentIdMap.has(originalId)) {
    studentIdMap.set(
      originalId,
      `STU-${String(studentCounter++).padStart(3, "0")}`
    );
  }
  return studentIdMap.get(originalId)!;
};

const getAnonStudentName = (anonId: string): string =>
  `Student ${anonId.split("-")[1]}`;

const getAnonTeacher = (teacherName: string): string => {
  if (!teacherMap.has(teacherName)) {
    teacherMap.set(
      teacherName,
      `Teacher ${String.fromCharCode(65 + teacherCounter++)}`
    );
  }
  return teacherMap.get(teacherName)!;
};

/* ===============================
   Row → Student Mapping
=============================== */
const mapRowToStudent = (row: any): StudentRecord => {
  const get = (header: string) => {
    const key = Object.keys(row).find(
      k => normalizeHeader(k) === normalizeHeader(header)
    );
    return key ? row[key] : "";
  };

  const originalStudentId = clean(get("STU_ID")) || Math.random().toString(36);
  const anonId = getAnonStudentId(originalStudentId);

  const originalTeacher = clean(get("TEACHER_NAME"));
  const anonTeacher = originalTeacher
    ? getAnonTeacher(originalTeacher)
    : "Teacher A";

  const pm1Level = parseFastLevel(get("FAST Math PM1 Level"));
  const pm2Level = parseFastLevel(get("FAST Math PM2 Level"));

  return {
    /* Anonymized identity */
    id: anonId,
    name: getAnonStudentName(anonId),
    teacher: anonTeacher,

    /* Program flags */
    ell: clean(get("ELL")),
    ese: clean(get("ESE")),

    /* Attendance */
    absences: Number(get("2425 Absences") || 0),

    /* FAST PM1 */
    fastPm1Level: pm1Level,
    fastPm1Score: numOrString(get("FAST Math PM1 SS")),
    fastPm1Percentile: numOrString(get("FAST Math PM1 %tile")),
    fastPm1Proficiency: getProficiencyStatus(pm1Level),

    /* FAST PM2 */
    fastPm2Level: pm2Level,
    fastPm2Score: numOrString(get("FAST Math PM2 SS")),
    fastPm2Percentile: numOrString(get("FAST Math PM2 %tile")),
    fastPm2Proficiency: getProficiencyStatus(pm2Level),

    /* Growth */
    growthStatus: getGrowthStatus(pm1Level, pm2Level),

    /* Prior year FAST (PM3 – 2324) */
    priorFastPm3Score: numOrString(get("2324 Math Score")),

    /* Lowest 25 / 35 */
    l25l35Indicator: clean(get("Math L25/35")),

    /* Preserve raw row internally only */
    raw: row,
  };
};

/* ===============================
   File Entry Point
=============================== */
export const parseFile = async (file: File): Promise<ParseResult> => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  /* ---------- CSV ---------- */
  if (ext === "csv") {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) =>
          resolve({
            students: results.data.map(mapRowToStudent),
            headers: results.meta.fields ?? [],
          }),
        error: reject,
      });
    });
  }

  /* ---------- Excel ---------- */
  if (ext === "xlsx" || ext === "xls") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const wb = XLSX.read(
            new Uint8Array(e.target?.result as ArrayBuffer),
            { type: "array" }
          );
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet);
          resolve({
            students: json.map(mapRowToStudent),
            headers: json.length ? Object.keys(json[0]) : [],
          });
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  throw new Error("Unsupported file format. Please upload CSV or Excel.");
};
