import { useEffect, useState } from "react";
import { maintenanceApi } from "../api/maintenanceApi";

export interface MaintenanceItem {
  id: number;
  roomId: number;
  studentName: string;
  title: string;
  description: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed" | "InProgress";
  createdAt: string;
}

// Bảng map từ Số sang Chữ (Khớp với Enum trong C#)
const STATUS_MAP: Record<number, string> = {
  0: "Pending",
  1: "InProgress",
  2: "Completed",
  3: "Approved",
  4: "Rejected"
};

export function useMaintenance() {
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const res = await maintenanceApi.getAll();

      const mapped: MaintenanceItem[] = res.data.map((m: any) => {
        // Xử lý chuyển đổi trạng thái tại đây
        // Nếu Backend trả về số (0,1...), ta map sang chữ. 
        // Nếu đã là chữ rồi thì giữ nguyên.
        let mappedStatus = m.status;
        if (typeof m.status === 'number') {
            mappedStatus = STATUS_MAP[m.status] || "Pending";
        }

        return {
          id: m.id,
          roomId: m.roomId,
          studentName: m.student?.fullName ?? "—",
          title: m.title,
          description: m.description,
          status: mappedStatus, 
          createdAt: m.createdAt,
        };
      });

      setItems(mapped);
    } catch (err) {
      console.error(err);
      setError("Không thể tải yêu cầu bảo trì");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    items,
    loading,
    error,
    reload: load,
  };
}