export interface TenantInfo {
  id: number;
  studentId: number;
  roomId: number;
  status: string;
  startDate?: string | null;
  endDate?: string | null;

  student: {
    id: number;
    fullName: string;
    studentId: string;
    className: string;
  };
}
