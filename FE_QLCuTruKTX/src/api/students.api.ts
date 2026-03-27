import axiosClient from "./index";
import { Student } from "../types/student";

export const studentsApi = {
  getAll: () =>
    axiosClient.get<Student[]>("/Students").then(res => res.data),

  getById: (id: number) =>
    axiosClient.get<Student>(`/Students/${id}`).then(res => res.data),

  updateByAdmin: (id: number, data: Partial<Student>) =>
    axiosClient.put<Student>(`/Students/${id}`, data).then(res => res.data),
};
