
export type TabOption = 'attendance' | 'student' | 'group';

export interface AttendanceResult {
  attendance: number;
  nonAttendance: number;
}

export interface GroupAverageResult {
  groupAverage: number;
  averageOn10: number;
  approvalRate: number;
  passedCount: number;
  failedCount: number;
}

export interface Criterion {
  id: string;
  name: string;
  score: string;
}

export interface Student {
  id: string;
  grade: string;
}

// --- SYSTEM TYPES ---
export type Role = 'admin' | 'docente';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: Role;
}

export interface Classroom {
  id: string;
  name: string;
  teacherId: string;
}

export interface EnrolledStudent {
    id: string;
    name: string;
    classroomId: string;
    grade: number | null; // Promedio Final
    partialGrades: (number | null)[]; // Array de 5 calificaciones
    dob?: string;          // Fecha de nacimiento
    access_code?: string;  // Contraseña única generada
}
