import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

/* Đăng ký chart */
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface StatsProps {
  stats: {
    students: number;
    rooms: number;
    maintenancePending: number;
    roommatePending: number;
    formsPending: number;
  };
}

export default function StatsChart({ stats }: StatsProps) {
  const data = {
    labels: [
      "Sinh viên",
      "Phòng",
      "Bảo trì chờ",
      "Ở ghép chờ",
      "Đơn chờ duyệt",
    ],
    datasets: [
      {
        label: "Số lượng",
        data: [
          stats.students,
          stats.rooms,
          stats.maintenancePending,
          stats.roommatePending,
          stats.formsPending,
        ],
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
          "#ef4444",
        ],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="flex justify-center">
      <div className="glass-card p-6 w-full max-w-5xl">
        <h2 className="text-lg font-semibold text-white/80 mb-4">
          Thống kê tổng quan
        </h2>

        <div className="h-[360px]">
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: "#cbd5f5",
                  },
                },
              },
              scales: {
                x: {
                  ticks: { color: "#cbd5f5" },
                  grid: { color: "rgba(255,255,255,0.05)" },
                },
                y: {
                  ticks: { color: "#cbd5f5" },
                  grid: { color: "rgba(255,255,255,0.05)" },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
