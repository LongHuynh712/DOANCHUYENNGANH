import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, RefreshCw, Plus } from "lucide-react"; // 🔥 Thêm Plus
import axiosClient from "../../api";
import StudentDetailModal from "./components/StudentDetailModal";
import StudentEditModal from "./components/StudentEditModal";
import CreateStudentModal from "../../components/CreateStudentModal"; // 🔥 Import Modal mới
import { Student } from "../../types/student";

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State tìm kiếm & lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // State Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State Modal
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false); // 🔥 State cho Modal thêm mới

  // 1. Load dữ liệu
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get<Student[]>("/students");
      
      const mappedData = res.data.map((s: any) => ({
        ...s,
        dateOfBirth: s.dateOfBirth || "",
        gender: s.gender || "Nam",
        address: s.address || "",
        idCard: s.idCard || "",
        avatarUrl: s.avatarUrl || "",
        phone: s.phone || s.phoneNumber || "",
        email: s.email || ""
      }));

      setStudents(mappedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. Logic Lọc & Tìm kiếm
  const filteredStudents = useMemo(() => {
    setCurrentPage(1); 
    return students.filter((s) => {
      const matchSearch = 
        (s.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.studentId || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const sStatus = (s.status || "").toLowerCase();
      const matchStatus = filterStatus === "All" || 
        (filterStatus === "active" && (sStatus === "active" || sStatus === "đang ở")) ||
        (filterStatus === "inactive" && sStatus !== "active" && sStatus !== "đang ở");

      return matchSearch && matchStatus;
    });
  }, [students, searchTerm, filterStatus]);

  // 3. Logic Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const renderStatus = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "active" || s === "đang ở") 
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">● Đang ở</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">● Ngừng ở</span>;
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0f172a]">
      <div className="text-blue-500 animate-spin">⟳</div>
    </div>
  );

  return (
    <div className="p-6 text-white h-full flex flex-col max-w-[1600px] mx-auto min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
           <Link to="/admin/dashboard" className="p-3 rounded-xl bg-[#1e293b] hover:bg-blue-600 text-gray-400 hover:text-white border border-gray-700 transition shadow-lg flex items-center justify-center">
             <ArrowLeft size={20} />
           </Link>
           <div>
             <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
               Quản lý Sinh viên
             </h1>
             <p className="text-gray-400 text-sm mt-1">Danh sách sinh viên đang cư trú</p>
           </div>
        </div>

        <div className="flex gap-2">
            <button onClick={fetchStudents} className="px-4 py-2 bg-[#1e293b] hover:bg-white/10 border border-gray-600 rounded-lg text-sm transition flex items-center gap-2">
              <RefreshCw size={16} /> Làm mới
            </button>
            {/* 🔥 NÚT THÊM MỚI */}
            <button onClick={() => setIsCreateOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold shadow-lg flex items-center gap-2 transition">
              <Plus size={18} /> Thêm sinh viên
            </button>
        </div>
      </div>

      {/* --- TOOLBAR --- */}
      <div className="bg-[#1e293b] p-4 rounded-xl border border-white/10 shadow-lg mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
           <span className="absolute left-3 top-3 text-gray-400"><Search size={18} /></span>
           <input type="text" placeholder="Tìm kiếm theo Tên hoặc MSSV..." className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-blue-500 outline-none transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500 cursor-pointer" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">Tất cả trạng thái</option>
          <option value="active">Đang ở (Active)</option>
          <option value="inactive">Ngừng ở (Inactive)</option>
        </select>
      </div>

      {/* --- TABLE --- */}
      <div className="flex-1 overflow-hidden bg-[#1e293b] rounded-xl border border-white/10 shadow-xl flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900 text-gray-100 uppercase text-xs font-semibold sticky top-0 z-10">
              <tr>
                <th className="p-4">MSSV</th>
                <th className="p-4">Họ và Tên</th>
                <th className="p-4">Lớp</th>
                <th className="p-4">Khoa</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentStudents.length === 0 ? (
                 <tr><td colSpan={6} className="p-8 text-center italic text-gray-500">Không tìm thấy dữ liệu.</td></tr>
              ) : (
                currentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 transition duration-150 group">
                    <td className="p-4 font-mono text-yellow-400 font-bold">{student.studentId}</td>
                    <td className="p-4 font-medium text-white text-base">{student.fullName}</td>
                    <td className="p-4">{student.className}</td>
                    <td className="p-4">{student.faculty}</td>
                    <td className="p-4 text-center">{renderStatus(student.status)}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2 opacity-80 group-hover:opacity-100 transition">
                          <button onClick={() => { setSelectedStudent(student); setIsDetailOpen(true); }} className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition" title="Xem chi tiết">👁️</button>
                          <button onClick={() => { setSelectedStudent(student); setIsEditOpen(true); }} className="p-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-white rounded-lg transition" title="Chỉnh sửa">✏️</button>
                      </div>
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
            <span className="text-xs text-gray-400">Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredStudents.length)} trên tổng {filteredStudents.length}</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-[#1e293b] border border-gray-700 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"><ChevronLeft size={16} /></button>
              <span className="px-4 py-2 bg-[#1e293b] rounded-lg text-sm font-bold border border-gray-700">{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-[#1e293b] border border-gray-700 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {isDetailOpen && selectedStudent && <StudentDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} student={selectedStudent} />}
      {isEditOpen && selectedStudent && <StudentEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} student={selectedStudent} onSuccess={() => { fetchStudents(); setIsEditOpen(false); }} />}
      
      {/* 🔥 MODAL THÊM MỚI */}
      <CreateStudentModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSuccess={fetchStudents} 
      />
    </div>
  );
}