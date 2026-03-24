export type UserRole = 'admin' | 'docente';

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: UserRole;
}

export interface Classroom {
  id: string;
  name: string;
  teacherId: string;
}

export interface Student {
  id: string;
  name: string;
  classroomId: string;
  access_code: string;
  dob?: string;
  partialGrades: (number | null)[];
  grade: number | null;
}

export interface AttendanceResult {
  attendance: number;
  nonAttendance: number;
}

export interface GroupStats {
  avg: number;
  app: number;
  failed: number;
}
