import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Search, RefreshCw, Wrench, Filter,
  CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Eye
} from "lucide-react";
import axiosClient from "../../api";

// 1. Định nghĩa kiểu dữ liệu
interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  studentName?: string; // Tên SV (Backend trả về)
  studentId?: string;
  roomNumber?: string;  // Số phòng (Backend trả về)
  status: number;       // 0:Pending, 1:InProgress, 2:Completed, 3:Approved, 4:Rejected
  createdAt: string;
}

// --- COMPONENT MODAL CHI TIẾT & XỬ LÝ ---
const MaintenanceDetailModal = ({ 
  isOpen, onClose, request, onUpdateStatus 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  request: MaintenanceRequest | null;
  onUpdateStatus: (id: number, status: number) => void;
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl animate-fade-in-up overflow-hidden">
        
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Wrench size={20} /> Chi tiết yêu cầu #{request.id}
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white">&times;</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Thông tin người gửi */}
          <div className="grid grid-cols-2 gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold">Sinh viên</label>
              <p className="text-white font-medium">{request.studentName || "—"}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold">Phòng</label>
              <p className="text-yellow-400 font-bold text-lg">{request.roomNumber || "—"}</p>
            </div>
          </div>

          {/* Nội dung báo hỏng */}
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Tiêu đề</label>
            <div className="text-white font-bold text-lg mb-2">{request.title}</div>
            
            <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Mô tả chi tiết</label>
            <div className="bg-gray-900 p-4 rounded-xl text-gray-300 text-sm border border-gray-700 min-h-[80px]">
              {request.description}
            </div>
          </div>

          {/* Thời gian */}
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock size={12} /> Gửi lúc: {new Date(request.createdAt).toLocaleString("vi-VN")}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-900 border-t border-white/5 flex flex-col gap-3">
          <p className="text-xs text-gray-400 text-center uppercase font-bold">Cập nhật trạng thái</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {/* Logic hiển thị nút bấm tùy trạng thái hiện tại */}
            <button onClick={() => onUpdateStatus(request.id, 3)} className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
              <CheckCircle size={14} /> Duyệt (Approved)
            </button>
            <button onClick={() => onUpdateStatus(request.id, 1)} className="px-3 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
              <Wrench size={14} /> Đang sửa (In Progress)
            </button>
            <button onClick={() => onUpdateStatus(request.id, 2)} className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
              <CheckCircle size={14} /> Hoàn thành (Done)
            </button>
            <button onClick={() => onUpdateStatus(request.id, 4)} className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
              <XCircle size={14} /> Từ chối (Reject)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function MaintenanceManagement() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal
  const [selectedReq, setSelectedReq] = useState<MaintenanceRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Load Data
  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Gọi API lấy toàn bộ danh sách bảo trì
      const res = await axiosClient.get<MaintenanceRequest[]>("/maintenance"); 
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. Update Status
  const handleUpdateStatus = async (id: number, status: number) => {
    try {
      await axiosClient.put(`/maintenance/${id}/status`, { status }); // Gọi API update
      alert("Cập nhật thành công!");
      setIsModalOpen(false);
      fetchRequests(); // Reload lại bảng
    } catch (error) {
      alert("Lỗi cập nhật trạng thái.");
    }
  };

  // 3. Logic Lọc & Phân trang
  const filteredData = useMemo(() => {
    setCurrentPage(1); // Reset về trang 1 khi filter
    return requests.filter(r => {
      // Tìm theo Tên SV hoặc Phòng hoặc Tiêu đề
      const matchSearch = 
        (r.studentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.roomNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.title || "").toLowerCase().includes(searchTerm.toLowerCase());

      // Lọc trạng thái (Backend trả về số)
      // 0:Pending, 1:InProgress, 2:Completed, 3:Approved, 4:Rejected
      let matchStatus = true;
      if (filterStatus !== "All") {
        const s = Number(filterStatus);
        matchStatus = r.status === s;
      }
      return matchSearch && matchStatus;
    });
  }, [requests, searchTerm, filterStatus]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Helper render trạng thái
  const renderStatus = (status: number) => {
    switch (status) {
      case 0: return <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-bold">Chờ xử lý</span>;
      case 1: return <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">Đang sửa</span>;
      case 2: return <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold">Hoàn thành</span>;
      case 3: return <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">Đã duyệt</span>;
      case 4: return <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">Từ chối</span>;
      default: return <span className="text-gray-500">-</span>;
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#0f172a] text-orange-500 animate-spin">⟳</div>;

  return (
    <div className="p-6 text-white h-full flex flex-col max-w-[1600px] mx-auto min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
           <Link to="/admin/dashboard" className="p-3 rounded-xl bg-[#1e293b] hover:bg-orange-600 text-gray-400 hover:text-white border border-gray-700 transition shadow-lg">
             <ArrowLeft size={20} />
           </Link>
           <div>
             <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
               Quản lý Bảo trì
             </h1>
             <p className="text-gray-400 text-sm mt-1">Xử lý yêu cầu sửa chữa từ sinh viên</p>
           </div>
        </div>
        <button onClick={fetchRequests} className="px-4 py-2 bg-[#1e293b] hover:bg-white/10 border border-gray-600 rounded-lg text-sm transition flex items-center gap-2">
          <RefreshCw size={16} /> Làm mới
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="bg-[#1e293b] p-4 rounded-xl border border-white/10 shadow-lg mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
           <span className="absolute left-3 top-3 text-gray-400"><Search size={18} /></span>
           <input 
             type="text" 
             placeholder="Tìm theo tên SV, số phòng..." 
             className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-orange-500 outline-none"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400"><Filter size={18} /></span>
            <select 
              className="bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white outline-none focus:border-orange-500 appearance-none cursor-pointer min-w-[200px]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="0">⏳ Chờ xử lý</option>
              <option value="3">👍 Đã duyệt</option>
              <option value="1">🛠️ Đang sửa</option>
              <option value="2">✅ Hoàn thành</option>
              <option value="4">❌ Từ chối</option>
            </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-hidden bg-[#1e293b] rounded-xl border border-white/10 shadow-xl flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900 text-gray-100 uppercase text-xs font-semibold">
              <tr>
                <th className="p-4">Sinh viên</th>
                <th className="p-4">Phòng</th>
                <th className="p-4">Tiêu đề</th>
                <th className="p-4">Ngày gửi</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentItems.length === 0 ? (
                 <tr><td colSpan={6} className="p-8 text-center italic text-gray-500">Không tìm thấy yêu cầu nào.</td></tr>
              ) : (
                currentItems.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition group">
                    <td className="p-4 font-bold text-white">{req.studentName || "—"}</td>
                    <td className="p-4 text-orange-400 font-bold">{req.roomNumber || "—"}</td>
                    <td className="p-4 max-w-xs truncate" title={req.title}>{req.title}</td>
                    <td className="p-4 text-gray-400">{new Date(req.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td className="p-4 text-center">{renderStatus(req.status)}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => { setSelectedReq(req); setIsModalOpen(true); }}
                        className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition shadow-sm"
                        title="Xem chi tiết & Xử lý"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="p-4 bg-gray-900 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-gray-400">Trang {currentPage} / {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 bg-[#1e293b] border border-gray-700 hover:bg-white/10 rounded-lg disabled:opacity-50"><ChevronLeft size={16} /></button>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 bg-[#1e293b] border border-gray-700 hover:bg-white/10 rounded-lg disabled:opacity-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      <MaintenanceDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        request={selectedReq}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}