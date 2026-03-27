import { useEffect, useState } from "react";
import { getForms } from "../api/forms.api";

export interface FormItem {
  id: number;

  studentCode: string;
  studentName: string;

  type: string;
  diaDiem: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  lyDo: string;

  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export function useForms() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadForms() {
    try {
      setLoading(true);
      const res = await getForms();

      const mapped: FormItem[] = res.map((f: any) => ({
        id: f.id,

        studentCode: f.student?.studentId ?? "—",
        studentName: f.student?.fullName ?? "—",

        type: f.loaiDon,
        diaDiem: f.diaDiem ?? "",
        ngayBatDau: f.ngayBatDau,
        ngayKetThuc: f.ngayKetThuc,
        lyDo: f.lyDo ?? "",

        createdAt: f.ngayTao,
        status: f.trangThai,
      }));

      setForms(mapped);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách đơn");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadForms();
  }, []);

  return { forms, loading, error, reloadForms: loadForms };
}
