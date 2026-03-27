import { useEffect, useState } from "react";
import axiosClient from "../../api"; 

// Interface linh hoạt (chấp nhận cả chữ hoa/thường để tránh lỗi)
interface FormRequest {
  id: number;
  loaiDon?: string; LoaiDon?: string;
  lyDo?: string; LyDo?: string;
  ngayTao?: string; NgayTao?: string;
  trangThai?: string; TrangThai?: string;
  student?: { studentId: string; fullName: string };
  Student?: { StudentId: string; FullName: string };
}

export default function FormsManagement() {
  const [items, setItems] = useState<FormRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      // Gọi API lấy danh sách
      const res = await axiosClient.get<FormRequest[]>("/forms");
      setItems(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Hàm lấy dữ liệu an toàn (Dù Backend trả hoa hay thường đều lấy được)
  const getVal = (item: any, keyLower: string, keyUpper: string) => {
    return item[keyLower] || item[keyUpper] || "—";
  };

  // Hàm lấy thông tin sinh viên an toàn
  const getStudentInfo = (item: any) => {
    if (item.student) return { 
        mssv: item.student.studentId || item.student.StudentId, 
        name: item.student.fullName || item.student.FullName 
    };
    if (item.Student) return { 
        mssv: item.Student.StudentId || item.Student.studentId, 
        name: item.Student.FullName || item.Student.fullName 
    };
    return { mssv: "—", name: "—" };
  };

  const handleUpdateStatus = async (id: number, status: "approved" | "rejected") => {
    const actionText = status === "approved" ? "DUYỆT" : "TỪ CHỐI";
    if (!window.confirm(`Bạn có chắc muốn ${actionText} đơn này?`)) return;

    try {
      setUpdatingId(id);
      await axiosClient.put(`/forms/${id}/status`, { trangThai: status });
      await loadData();
      alert("Cập nhật thành công!");
    } catch { 
      alert("Lỗi cập nhật, vui lòng thử lại."); 
    } finally { 
      setUpdatingId(null); 
    }
  };

  const renderStatus = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "pending") return <span className="text-yellow-400 font-bold text-xs border border-yellow-500/30 bg-yellow-500/20 px-2 py-1 rounded">Chờ xử lý</span>;
    if (s === "approved") return <span className="text-green-400 font-bold text-xs border border-green-500/30 bg-green-500/20 px-2 py-1 rounded">Đã duyệt</span>;
    if (s === "rejected") return <span className="text-red-400 font-bold text-xs border border-red-500/30 bg-red-500/20 px-2 py-1 rounded">Từ chối</span>;
    return <span>{status}</span>;
  };

  if (loading) return <div className="p-6 text-white">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Đơn từ</h1>
        <button 
            onClick={loadData} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition shadow-lg"
        >
            Làm mới
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1e293b] overflow-x-auto shadow-lg">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-900 text-gray-100 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">MSSV</th>
              <th className="p-4">Họ tên</th>
              <th className="p-4">Loại đơn</th>
              <th className="p-4">Lý do</th>
              <th className="p-4">Ngày gửi</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {items.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center italic text-gray-500">Chưa có dữ liệu đơn từ nào.</td></tr>
            ) : (
                items.map((item) => {
                const sv = getStudentInfo(item);
                const ngayTao = getVal(item, "ngayTao", "NgayTao");
                const status = getVal(item, "trangThai", "TrangThai");
                const loaiDon = getVal(item, "loaiDon", "LoaiDon");
                const lyDo = getVal(item, "lyDo", "LyDo");

                return (
                    <tr key={item.id} className="hover:bg-white/5 transition duration-150">
                    <td className="p-4 font-mono text-yellow-400">{sv.mssv}</td>
                    <td className="p-4 font-medium text-white">{sv.name}</td>
                    <td className="p-4 text-blue-300 font-bold">{loaiDon}</td>
                    <td className="p-4 max-w-xs truncate text-gray-400" title={lyDo}>{lyDo}</td>
                    <td className="p-4 text-gray-400">
                        {ngayTao !== "—" ? new Date(ngayTao).toLocaleDateString("vi-VN") : "—"}
                    </td>
                    <td className="p-4 text-center">{renderStatus(status)}</td>
                    <td className="p-4 text-center">
                        {(status || "").toLowerCase() === "pending" ? (
                        <div className="flex gap-2 justify-center">
                            <button 
                                disabled={updatingId === item.id} 
                                onClick={() => handleUpdateStatus(item.id, "approved")} 
                                className={`px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white transition ${updatingId === item.id ? 'opacity-50' : ''}`}
                            >
                                Duyệt
                            </button>
                            <button 
                                disabled={updatingId === item.id} 
                                onClick={() => handleUpdateStatus(item.id, "rejected")} 
                                className={`px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white transition ${updatingId === item.id ? 'opacity-50' : ''}`}
                            >
                                Từ chối
                            </button>
                        </div>
                        ) : <span className="text-gray-600 italic text-xs">Đã xử lý</span>}
                    </td>
                    </tr>
                );
                })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}