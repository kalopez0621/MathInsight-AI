import { StudentRecord } from "../types";

export const isProficient = (status: string) =>
  status === "Proficient";

export const calculateProficiencyRate = (
  students: StudentRecord[],
  period: "PM1" | "PM2"
): number => {
  const relevant = students.filter(s =>
    period === "PM1"
      ? s.fastPm1Proficiency !== "Not Assessed"
      : s.fastPm2Proficiency !== "Not Assessed"
  );

  if (!relevant.length) return 0;

  const proficientCount = relevant.filter(s =>
    period === "PM1"
      ? isProficient(s.fastPm1Proficiency)
      : isProficient(s.fastPm2Proficiency)
  ).length;

  return Math.round((proficientCount / relevant.length) * 100);
};
