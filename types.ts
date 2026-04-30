export type GrowthStatus =
  | "Improved"
  | "Maintained"
  | "Regressed"
  | "Insufficient Data";


export interface StudentRecord {
  id: string;
  name: string;

  ell: string; // "1"-"4" current, "5" former, blank = no
  ese: string; // K / P / V or blank

  absences: number;

  /* FAST PM1 */
  fastPm1Score: number | string;
  fastPm1Level: number | null;
  fastPm1Percentile: number | string;
  fastPm1Proficiency: "Proficient" | "Not Proficient" | "Not Assessed";

  /* FAST PM2 */
  fastPm2Score: number | string;
  fastPm2Level: number | null;
  fastPm2Percentile: number | string;
  fastPm2Proficiency: "Proficient" | "Not Proficient" | "Not Assessed";

  growthStatus: GrowthStatus;

  /* Prior year (PM3) */
  priorFastPm3Score: number | string;

  /* Lowest 25 / 35 */
  l25l35Indicator: string; // "L25", "L35", or blank

  /* Preserve original row */
  raw: Record<string, any>;
}


export type SubgroupFilter = 'ALL' | 'ELL' | 'ESE' | 'L25' | 'L35' |'IMPROVED'  | 'MAINTAINED'  | 'REGRESSED'  | 'NO_DATA';

export interface AIAnalysisResult {
  summary: string;
  growthTrends: string;
  regressionFlags: { studentName: string; reason: string }[];
  groupingSuggestions: { groupName: string; students: string[]; focusArea: string }[];
  instructionalStrategies: string[];
}

export interface ParseResult {
  students: StudentRecord[];
  headers: string[];
}
