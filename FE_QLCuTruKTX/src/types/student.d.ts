export interface Student {
  id: number;
  studentId: string; // MSSV
  fullName: string;
  
  // Thông tin lớp/khoa
  className: string;
  faculty: string;
  
  // Trạng thái
  status: string; // "active" | "inactive" | "đang ở" | "ngừng ở"

  // Các trường bổ sung (Có thể có hoặc không - dùng dấu ?)
  email?: string;
  phone?: string;
  phoneNumber?: string; // Dự phòng trường hợp backend trả về tên này
  
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  idCard?: string; // CMND/CCCD
  avatarUrl?: string; // Link ảnh đại diện
}