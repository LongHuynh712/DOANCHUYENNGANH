import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Search, Plus, Home, Users, Trash2, Edit, Eye, 
  ChevronLeft, ChevronRight, X, Save 
} from "lucide-react";
import { roomApi } from "../../api/roomApi";
import { Room } from "../../types/room";

// --- 1. COMPONENT: MODAL DANH SÁCH SINH VIÊN ---
const StudentListModal = ({ isOpen, onClose, roomData }: { isOpen: boolean; onClose: () => void; roomData: Room | null }) => {
  if (!isOpen || !roomData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users size={20} /> Danh sách sinh viên - Phòng {roomData.roomNumber}
          </h3>
          <button onClick={onClose}><X className="text-white hover:rotate-90 transition" /></button>
        </div>
        
        <div className="p-6">
          <div className="mb-4 flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
             <span className="text-gray-400 text-sm">Sĩ số hiện tại:</span>
             <span className={`font-bold ${roomData.currentOccupancy >= roomData.capacity ? 'text-red-400' : 'text-green-400'}`}>
                {roomData.currentOccupancy} / {roomData.capacity}
             </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-900 text-gray-100 uppercase text-xs">
                <tr>
                  <th className="p-3">MSSV</th>
                  <th className="p-3">Họ và Tên</th>
                  <th className="p-3">Lớp</th>
                  <th className="p-3">Ngày vào</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800/50">
                {(!roomData.tenancies || roomData.tenancies.length === 0) ? (
                  <tr><td colSpan={4} className="p-6 text-center italic text-gray-500">Phòng trống.</td></tr>
                ) : (
                  roomData.tenancies.map((t: any) => (
                    <tr key={t.id} className="hover:bg-white/5">
                      <td className="p-3 font-mono text-yellow-400">{t.student?.studentId || "—"}</td>
                      <td className="p-3 font-bold text-white">{t.student?.fullName || "—"}</td>
                      <td className="p-3">{t.student?.className || "—"}</td>
                      <td className="p-3 text-gray-400">{new Date(t.startDate).toLocaleDateString("vi-VN")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-4 bg-gray-900 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm">Đóng</button>
        </div>
      </div>
    </div>
  );
};

// --- 2. COMPONENT: MODAL THÊM / SỬA PHÒNG ---
const RoomModal = ({ isOpen, onClose, onSubmit, initialData }: { isOpen: boolean; onClose: () => void; onSubmit: (data: Partial<Room>) => void; initialData: Partial<Room> | null }) => {
  const [formData, setFormData] = useState<Partial<Room>>({
    roomNumber: "", capacity: 6, buildingId: 1, status: "empty",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ roomNumber: "", capacity: 6, buildingId: 1, status: "empty" });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl animate-fade-in-up">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{initialData ? "Cập nhật phòng" : "Thêm phòng mới"}</h2>
          <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Số phòng</label>
            <input type="text" value={formData.roomNumber} onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" placeholder="VD: A101" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Sức chứa</label>
              <input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tòa nhà (ID)</label>
              <input type="number" value={formData.buildingId} onChange={e => setFormData({ ...formData, buildingId: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2.5 text-white" />
            </div>
          </div>
          {initialData && (
             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Trạng thái</label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2.5 text-white">
                    <option value="empty">Trống</option>
                    <option value="available">Còn chỗ</option>
                    <option value="full">Đầy</option>
                </select>
             </div>
          )}
        </div>

        <div className="p-4 bg-gray-900 flex justify-end gap-2 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Hủy</button>
          <button onClick={() => onSubmit(formData)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center gap-2">
            <Save size={16} /> Lưu lại
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. TRANG CHÍNH ---
export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);

  async function loadRooms() {
    try {
      setLoading(true);
      const res = await roomApi.getAll();
      setRooms(res.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }

  useEffect(() => { loadRooms(); }, []);

  async function handleViewDetail(id: number) {
    try {
        const res = await roomApi.getById(id);
        setDetailRoom(res.data);
        setIsDetailModalOpen(true);
    } catch (error) { alert("Lỗi tải chi tiết!"); }
  }

  async function handleSave(data: Partial<Room>) {
    try {
      if (editingRoom) await roomApi.update(editingRoom.id, data);
      else await roomApi.create(data);
      alert("Thành công!");
      setIsFormModalOpen(false);
      loadRooms();
    } catch (error: any) { alert(error.response?.data?.message || "Lỗi lưu dữ liệu"); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Xóa phòng này?")) return;
    try { await roomApi.delete(id); loadRooms(); } catch { alert("Không thể xóa"); }
  }

  // Logic Lọc & Phân trang
  const filteredRooms = useMemo(() => {
    setCurrentPage(1);
    return rooms.filter(r => r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [rooms, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#0f172a] text-blue-500 animate-spin">⟳</div>;

  return (
    <div className="p-6 text-white h-full flex flex-col max-w-[1600px] mx-auto min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
           <Link to="/admin/dashboard" className="p-3 rounded-xl bg-[#1e293b] hover:bg-blue-600 text-gray-400 hover:text-white border border-gray-700 transition shadow-lg">
             <ArrowLeft size={20} />
           </Link>
           <div>
             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Quản lý Phòng KTX</h1>
             <p className="text-gray-400 text-sm mt-1">Sơ đồ và trạng thái phòng</p>
           </div>
        </div>
        <button onClick={() => { setEditingRoom(null); setIsFormModalOpen(true); }} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2">
          <Plus size={18} /> Thêm phòng mới
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="bg-[#1e293b] p-4 rounded-xl border border-white/10 shadow-lg mb-6">
        <div className="relative">
           <span className="absolute left-3 top-3 text-gray-400"><Search size={18} /></span>
           <input type="text" placeholder="Tìm kiếm số phòng..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-96 bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-blue-500 outline-none" />
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-hidden bg-[#1e293b] rounded-xl border border-white/10 shadow-xl flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900 text-gray-100 uppercase text-xs font-semibold">
              <tr>
                <th className="p-4">Phòng</th>
                <th className="p-4">Tòa</th>
                <th className="p-4">Sức chứa</th>
                <th className="p-4">Trạng thái cư trú (Sĩ số)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentRooms.map((room) => {
                const occupancyRate = (room.currentOccupancy / room.capacity) * 100;
                return (
                  <tr key={room.id} className="hover:bg-white/5 transition group">
                    <td className="p-4 font-bold text-white text-lg flex items-center gap-2">
                        <Home size={16} className="text-gray-500" /> {room.roomNumber}
                    </td>
                    <td className="p-4 text-gray-400">{room.buildingId}</td>
                    <td className="p-4">{room.capacity}</td>
                    <td className="p-4 w-64">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${occupancyRate >= 100 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${occupancyRate}%` }}></div>
                            </div>
                            <span className="text-xs font-bold text-white">{room.currentOccupancy}/{room.capacity}</span>
                        </div>
                    </td>
                    <td className="p-4 text-center">
                        {room.status === 'full' && <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">Đầy</span>}
                        {room.status === 'available' && <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">Còn chỗ</span>}
                        {room.status === 'empty' && <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold">Trống</span>}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2 opacity-80 group-hover:opacity-100 transition">
                        <button onClick={() => handleViewDetail(room.id)} className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition" title="Xem SV"><Eye size={16} /></button>
                        <button onClick={() => { setEditingRoom(room); setIsFormModalOpen(true); }} className="p-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-white rounded-lg transition" title="Sửa"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(room.id)} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition" title="Xóa"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

      <RoomModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSubmit={handleSave} initialData={editingRoom} />
      <StudentListModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} roomData={detailRoom} />
    </div>
  );
}