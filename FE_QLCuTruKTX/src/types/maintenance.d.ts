export interface Room {
  id: number;
  roomNumber: string;
}

export interface MaintenanceRequest {
  id: number;
  sinhVienId: number;

  // phía user gửi
  title: string;
  description: string;

  // phía admin xử lý
  status: string;

  // liên kết phòng (admin list đang dùng)
  room?: Room;

  // optional
  createdAt?: string;
}
