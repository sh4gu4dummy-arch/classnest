import type { Student } from "./types";
import { toDateInputValue } from "./utils";

/** Local calendar day key YYYY-MM-DD */
export function todayKey(now = Date.now()): string {
  return toDateInputValue(now);
}

export type AttendanceStatus = "present" | "late" | "absent";

export function isAbsentToday(student: Student, now = Date.now()): boolean {
  return !!student.absentOn && student.absentOn === todayKey(now);
}

export function isLateToday(student: Student, now = Date.now()): boolean {
  if (isAbsentToday(student, now)) return false;
  return !!student.lateOn && student.lateOn === todayKey(now);
}

export function getAttendanceStatus(
  student: Student,
  now = Date.now(),
): AttendanceStatus {
  if (isAbsentToday(student, now)) return "absent";
  if (isLateToday(student, now)) return "late";
  return "present";
}

/** present → late → absent → present */
export function nextAttendanceStatus(current: AttendanceStatus): AttendanceStatus {
  if (current === "present") return "late";
  if (current === "late") return "absent";
  return "present";
}

/** Present for awards/spar = not fully absent (late still participates). */
export function presentStudents(students: Student[], now = Date.now()): Student[] {
  return students.filter((s) => !isAbsentToday(s, now));
}
