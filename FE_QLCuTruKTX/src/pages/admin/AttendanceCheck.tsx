import { useEffect, useState } from "react";
import axiosClient from "../../api";
import { Calendar, Save, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface AttendanceItem {
  studentId: number;
  studentName: string;
  roomNumber: string;
  status: string; // "Present" | "Excused" | "Unexcused"
  note: string;
}

export default function AttendanceCheck() {
  const [list, setList] = useState<AttendanceItem[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Mặc định hôm nay
  const [loading, setLoading] = useState(false);

  // Load danh sách khi chọn ngày
  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get<AttendanceItem[]>(`/attendance?date=${date}`);
        setList(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [date]);

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (id: number, newStatus: string) => {
    setList(prev => prev.map(item => 
      item.studentId === id ? { ...item, status: newStatus } : item
    ));
  };

  // Lưu điểm danh
  const handleSave = async () => {
    try {
      await axiosClient.post("/attendance", {
        date: date,
        records: list
      });
      alert("✅ Đã lưu điểm danh thành công!");
    } catch (err) {
      alert("❌ Lỗi khi lưu dữ liệu.");
    }
  };

  // Nhóm danh sách theo Phòng để dễ nhìn
  const groupedList = list.reduce((groups, item) => {
    const room = item.roomNumber;
    if (!groups[room]) groups[room] = [];
    groups[room].push(item);
    return groups;
  }, {} as Record<string, AttendanceItem[]>);

  return (
    <div className="p-6 text-white max-w-[1600px] mx-auto min-h-screen pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 sticky top-0 z-10 bg-[#0f172a]/95 backdrop-blur py-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Điểm danh KTX
          </h1>
          <p className="text-gray-400 text-sm">Kiểm tra quân số hàng ngày (Sau 22:30)</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18}/>
            <input 
              type="date" 
              className="bg-[#1e293b] border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:border-green-500 outline-none"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transition transform active:scale-95"
          >
            <Save size={18}/> Lưu chốt sổ
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center text-gray-500 mt-20 animate-pulse">Đang tải danh sách...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.keys(groupedList).sort().map(room => (
            <div key={room} className="bg-[#1e293b] rounded-xl border border-white/10 overflow-hidden shadow-md h-fit">
              <div className="bg-gray-800/50 px-4 py-3 font-bold text-blue-400 border-b border-white/5 flex justify-between">
                <span>🏠 Phòng {room}</span>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">
                    {groupedList[room].length} SV
                </span>
              </div>
              <div className="p-3 grid gap-3">
                {groupedList[room].map(sv => (
                  <div key={sv.studentId} className="flex flex-col gap-2 p-3 rounded-lg bg-black/20 hover:bg-black/40 transition border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          sv.status === 'Present' ? 'bg-green-500/20 text-green-400' : 
                          sv.status === 'Excused' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {sv.studentName.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-white text-sm truncate">{sv.studentName}</p>
                        {sv.note ? <p className="text-xs text-yellow-500 italic truncate">{sv.note}</p> 
                                 : <p className="text-[10px] text-gray-500">MSSV: {sv.studentId}</p>}
                      </div>
                    </div>

                    <div className="flex bg-[#0f172a] rounded-lg p-1 border border-white/10 justify-between">
                      <button onClick={() => handleStatusChange(sv.studentId, "Present")} title="Có mặt"
                        className={`flex-1 py-1 rounded text-xs font-bold flex justify-center items-center gap-1 transition ${sv.status === 'Present' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-green-400'}`}>
                        <CheckCircle size={14}/>
                      </button>
                      <button onClick={() => handleStatusChange(sv.studentId, "Excused")} title="Có phép"
                        className={`flex-1 py-1 rounded text-xs font-bold flex justify-center items-center gap-1 transition ${sv.status === 'Excused' ? 'bg-yellow-600 text-white' : 'text-gray-500 hover:text-yellow-400'}`}>
                        <AlertCircle size={14}/>
                      </button>
                      <button onClick={() => handleStatusChange(sv.studentId, "Unexcused")} title="Vắng"
                        className={`flex-1 py-1 rounded text-xs font-bold flex justify-center items-center gap-1 transition ${sv.status === 'Unexcused' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-red-400'}`}>
                        <XCircle size={14}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}