import { useCallback, useEffect, useState } from "react";
import { apiGet } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { Student } from "../types/student";

export function useStudentProfile(sinhVienId?: number | string) {
  const { user } = useAuth();
  const resolvedId = sinhVienId ?? user?.user?.sinhVienId;

  const [data, setData] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(!!resolvedId);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!resolvedId) {
      setData(null);
      setError("Missing student id");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const id = Number(resolvedId);
      const res = await apiGet<any>(`/Students/${id}`);

      const mapped: Student = {
  id: Number(res.sinhVienId ?? res.id ?? id),
  studentId: res.mssv ?? "",
  fullName: res.hoTen ?? "",
  dateOfBirth: res.ngaySinh ? res.ngaySinh.substring(0, 10) : "",
  gender:
    res.gioiTinh === "Nam"
      ? "male"
      : res.gioiTinh === "Nữ"
      ? "female"
      : "other",
  phone: res.sdt ?? "",
  email: res.email ?? "",
  className: res.lop ?? "",
  faculty: res.khoa ?? "",
  idCard: res.soCCCD ?? "",
  address: res.queQuan ?? "",
  status:
    res.trangThai === "Đang ở"
      ? "active"
      : res.trangThai === "Ngừng ở"
      ? "inactive"
      : "not_residing",
};
      setData(mapped);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Lỗi tải thông tin sinh viên");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [resolvedId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { data, loading, error, refetch: fetchProfile } as const;
}
