import axiosClient from "./index"; // Import client đã cấu hình sẵn
import { Room } from "../types/room";

export const roomApi = {
  // Lấy danh sách
  getAll() {
    return axiosClient.get<Room[]>("/rooms");
  },

  // Lấy chi tiết 1 phòng
  getById(id: number) {
    return axiosClient.get<Room>(`/rooms/${id}`);
  },

  // Thêm mới
  create(data: Partial<Room>) {
    return axiosClient.post<Room>("/rooms", data);
  },

  // Cập nhật
  update(id: number, data: Partial<Room>) {
    return axiosClient.put<Room>(`/rooms/${id}`, data);
  },

  // Xóa
  delete(id: number) {
    return axiosClient.delete(`/rooms/${id}`);
  },
};