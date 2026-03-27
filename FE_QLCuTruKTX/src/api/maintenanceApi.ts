import axiosClient from "./index";
import { MaintenanceRequest } from "../types/maintenance";

export const maintenanceApi = {
  // SỬA: Gọi vào endpoint "all" dành cho Admin
  getAll() {
    return axiosClient.get<MaintenanceRequest[]>("/maintenance/all");
  },

  create(data: Partial<MaintenanceRequest>) {
    return axiosClient.post<MaintenanceRequest>("/maintenance", data);
  },

  updateStatus(id: number, status: "Approved" | "Rejected") {
    return axiosClient.put(`/maintenance/${id}/status`, {
      status,
    });
  },

  delete(id: number) {
    return axiosClient.delete(`/maintenance/${id}`);
  },
};