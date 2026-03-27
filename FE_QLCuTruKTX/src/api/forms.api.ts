import axiosClient from "./index";

/* =========================
   BACKEND RESPONSE SHAPE
========================= */
export interface FormDto {
  id: number;

  sinhVienId: number;
  student?: {
    id: number;
    studentId: string;
    fullName: string;
  };

  loaiDon: string;
  diaDiem: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  lyDo: string;

  ngayTao: string;
  trangThai: "pending" | "approved" | "rejected";
}


/* =========================
   ADMIN APIs
========================= */

// Admin xem tất cả đơn
export async function getForms(): Promise<FormDto[]> {
  const res = await axiosClient.get<FormDto[]>("/Forms");
  return res.data;
}

// Admin cập nhật trạng thái
export async function updateFormStatus(
  id: number,
  status: "approved" | "rejected"
) {
  return axiosClient.put(`/Forms/${id}/status`, {
    trangThai: status,
  });
}

/* =========================
   STUDENT APIs
========================= */

export const formsApi = {
  // Sinh viên xem đơn của mình
  getMyForms(svId: number) {
    return axiosClient.get<FormDto[]>(`/Forms/my/${svId}`);
  },

  // Sinh viên tạo đơn
  createForm(data: {
    sinhVienId: number;
    loaiDon: string;
    diaDiem: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    lyDo: string;
  }) {
    return axiosClient.post("/Forms", data);
  },
};
