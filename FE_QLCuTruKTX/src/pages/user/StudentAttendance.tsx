import { useEffect, useState } from "react";
import axiosClient from "../../api";
import { Calendar, CheckCircle, XCircle, AlertCircle, Clock, Filter } from "lucide-react";

// Định nghĩa kiểu dữ liệu trả về từ API
interface AttendanceRecord {
  date: string;
  status: string; // "Present", "Excused", "Unexcused"
  note: string;
}

export default function StudentAttendance() {
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Gọi API lấy lịch sử
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Gọi API mà bạn đã viết trong AttendanceController: [HttpGet("my-history")]
        const res = await axiosClient.get<AttendanceRecord[]>("/attendance/my-history");
        setHistory(res.data);
      } catch (err) {
        console.error("Lỗi tải lịch sử điểm danh:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // 2. Helper Render Trạng thái (Icon + Màu sắc)
  const renderStatus = (status: string) => {
    switch (status) {
      case "Present": 
        return (
          <span className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20 font-bold text-sm shadow-[0_0_10px_rgba(74,222,128,0.1)]">
            <CheckCircle size={16} /> Có mặt
          </span>
        );
      case "Excused": 
        return (
          <span className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 font-bold text-sm shadow-[0_0_10px_rgba(250,204,21,0.1)]">
            <AlertCircle size={16} /> Có phép
          </span>
        );
      case "Unexcused": 
        return (
          <span className="flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 font-bold text-sm shadow-[0_0_10px_rgba(248,113,113,0.1)]">
            <XCircle size={16} /> Vắng
          </span>
        );
      default: 
        return <span className="text-gray-500">-</span>;
    }
  };

  // 3. Tính toán Thống kê (Stats)
  const presentCount = history.filter(x => x.status === 'Present').length;
  const excusedCount = history.filter(x => x.status === 'Excused').length;
  const absentCount = history.filter(x => x.status === 'Unexcused').length;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen text-white relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent flex items-center gap-3">
          <Clock className="text-emerald-400" /> Lịch sử Điểm danh
        </h1>
        <p className="text-gray-400 text-sm mt-2 ml-1">Theo dõi quá trình sinh hoạt và chuyên cần tại KTX.</p>
      </div>

      {/* Stats Cards (Thẻ thống kê) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#1e293b]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between group hover:bg-[#1e293b]/80 transition">
            <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Số ngày có mặt</p>
                <p className="text-4xl font-bold text-green-400">{presentCount}</p>
            </div>
            <div className="p-4 bg-green-500/20 rounded-full text-green-400 group-hover:scale-110 transition"><CheckCircle size={28}/></div>
        </div>

        <div className="bg-[#1e293b]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between group hover:bg-[#1e293b]/80 transition">
            <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Vắng có phép</p>
                <p className="text-4xl font-bold text-yellow-400">{excusedCount}</p>
            </div>
            <div className="p-4 bg-yellow-500/20 rounded-full text-yellow-400 group-hover:scale-110 transition"><AlertCircle size={28}/></div>
        </div>

        <div className="bg-[#1e293b]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between group hover:bg-[#1e293b]/80 transition">
            <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Vắng không phép</p>
                <p className="text-4xl font-bold text-red-400">{absentCount}</p>
            </div>
            <div className="p-4 bg-red-500/20 rounded-full text-red-400 group-hover:scale-110 transition"><XCircle size={28}/></div>
        </div>
      </div>

      {/* History List Table (Danh sách chi tiết) */}
      <div className="bg-[#1e293b]/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
            <Filter size={16} className="text-gray-400"/>
            <span className="text-sm font-bold text-gray-300">Nhật ký chi tiết</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500 animate-pulse">Đang tải dữ liệu...</div>
        ) : history.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-gray-500">
            <Calendar size={48} className="mb-4 opacity-20" />
            <p>Chưa có dữ liệu điểm danh nào.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {history.map((record, index) => (
              <div key={index} className="p-4 md:p-5 hover:bg-white/5 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  
                  {/* Cột trái: Ngày tháng */}
                  <div className="flex items-center gap-4">
                      <div className="bg-white/5 p-3 rounded-xl text-center min-w-[70px] border border-white/10 shadow-inner">
                          <span className="block text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                            {new Date(record.date).toLocaleString('vi-VN', {weekday: 'short'})}
                          </span>
                          <span className="block text-2xl font-bold text-white leading-none mt-1">
                            {new Date(record.date).getDate()}
                          </span>
                          <span className="block text-[10px] text-gray-500">
                            Tháng {new Date(record.date).getMonth()+1}
                          </span>
                      </div>
                      <div>
                          <p className="text-white font-medium text-lg">
                            {new Date(record.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          {record.note ? (
                             <p className="text-sm text-yellow-500/80 italic mt-1 flex items-center gap-1">
                                📝 {record.note}
                             </p>
                          ) : (
                             <p className="text-xs text-gray-500 mt-1">Không có ghi chú</p>
                          )}
                      </div>
                  </div>

                  {/* Cột phải: Trạng thái */}
                  <div>
                      {renderStatus(record.status)}
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}