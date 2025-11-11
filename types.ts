
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
