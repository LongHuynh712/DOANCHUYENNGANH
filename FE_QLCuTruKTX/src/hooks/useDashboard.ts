import { useEffect, useState } from "react";
import { apiGet } from "../api";

interface DashboardStats {
  students: number;
  rooms: number;
  maintenancePending: number;
  roommatePending: number;
  formsPending: number;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await apiGet<DashboardStats>("/Dashboard/stats");
        setStats(res);
      } catch {
        setError("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { stats, loading, error };
}
