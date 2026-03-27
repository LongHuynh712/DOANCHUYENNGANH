import { useEffect, useState } from "react";
import axiosClient from "../../api";

// 1. Định nghĩa kiểu dữ liệu
interface ResidenceForm {
  id: number;
  loaiDon: string;   // "tam_tru" | "tam_vang"
  diaDiem: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  lyDo: string;
  trangThai: string; // "pending" | "approved" | "rejected"
  ngayTao: string;
}

interface StudentProfile {
  id: number;
  fullName: string;
}

export default function ResidenceForms() {
  const [forms, setForms] = useState<ResidenceForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [newForm, setNewForm] = useState({
    loaiDon: "tam_vang",
    diaDiem: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    lyDo: ""
  });

  const [studentId, setStudentId] = useState<number | null>(null);

  // 2. Tải dữ liệu
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const profileRes = await axiosClient.get<StudentProfile>("/students/profile");
        const sId = profileRes.data.id;
        setStudentId(sId);

        const formsRes = await axiosClient.get<ResidenceForm[]>(`/forms/my/${sId}`);
        setForms(formsRes.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 3. Xử lý Gửi đơn
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return alert("Không tìm thấy thông tin sinh viên!");
    if (!newForm.lyDo || !newForm.diaDiem || !newForm.ngayBatDau) return alert("Vui lòng nhập đủ thông tin!");

    try {
      setSubmitting(true);
      const payload = {
        ...newForm,
        sinhVienId: studentId,
        ngayTao: new Date().toISOString()
      };

      await axiosClient.post("/forms", payload);
      
      alert("Gửi đơn thành công!");
      setNewForm({ loaiDon: "tam_vang", diaDiem: "", ngayBatDau: "", ngayKetThuc: "", lyDo: "" });
      
      // Reload list
      const res = await axiosClient.get<ResidenceForm[]>(`/forms/my/${studentId}`);
      setForms(res.data);
      
    } catch (error) {
      alert("Gửi đơn thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: Render trạng thái "Xịn"
  const renderStatus = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === 'approved') return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
        <span className="text-sm">✓</span> Đã duyệt
      </span>
    );
    if (s === 'rejected') return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
        <span className="text-sm">✕</span> Từ chối
      </span>
    );
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span> Chờ xử lý
      </span>
    );
  };

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("vi-VN") : "—";

  return (
    <div className="min-h-screen text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[20%] left-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI: FORM ĐĂNG KÝ (GLASSMORPHISM) --- */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Tạo đơn mới
                </h2>
                <p className="text-xs text-gray-400 font-medium">Đăng ký tạm trú / tạm vắng</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Loại đơn */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Loại đơn</label>
                <div className="relative">
                  <select 
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
                    value={newForm.loaiDon}
                    onChange={e => setNewForm({...newForm, loaiDon: e.target.value})}
                  >
                    <option value="tam_vang" className="bg-gray-900">🛫 Đăng ký Tạm vắng</option>
                    <option value="tam_tru" className="bg-gray-900">🏠 Đăng ký Tạm trú</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</div>
                </div>
              </div>

              {/* Ngày tháng */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Từ ngày</label>
                  <input type="date" required
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    value={newForm.ngayBatDau}
                    onChange={e => setNewForm({...newForm, ngayBatDau: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Đến ngày</label>
                  <input type="date" required
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    value={newForm.ngayKetThuc}
                    onChange={e => setNewForm({...newForm, ngayKetThuc: e.target.value})}
                  />
                </div>
              </div>

              {/* Địa điểm */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  {newForm.loaiDon === "tam_vang" ? "Nơi đến" : "Địa chỉ tạm trú"}
                </label>
                <input type="text" required
                  placeholder={newForm.loaiDon === "tam_vang" ? "VD: Về quê Cà Mau..." : "VD: Phòng 101..."}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-4 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  value={newForm.diaDiem}
                  onChange={e => setNewForm({...newForm, diaDiem: e.target.value})}
                />
              </div>

              {/* Lý do */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Lý do</label>
                <textarea required rows={3}
                  placeholder="Nhập lý do chi tiết..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-4 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none"
                  value={newForm.lyDo}
                  onChange={e => setNewForm({...newForm, lyDo: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-500 hover:to-red-400 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {submitting ? "Đang xử lý..." : "🚀 Gửi đơn đăng ký"}
              </button>
            </form>
          </div>
        </div>

        {/* --- CỘT PHẢI: LỊCH SỬ ĐƠN --- */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-yellow-400">📂</span> Hồ sơ đơn từ
            </h2>
            <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
              Đã gửi: <strong className="text-white">{forms.length}</strong>
            </span>
          </div>

          {loading ? (
             <div className="space-y-4 animate-pulse">
               {[1,2,3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>)}
             </div>
          ) : forms.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white/5 backdrop-blur-md rounded-2xl border border-dashed border-white/10 text-gray-400">
              <span className="text-6xl mb-4 opacity-50">📭</span>
              <p className="text-lg">Chưa có dữ liệu.</p>
              <p className="text-sm opacity-60">Hãy tạo đơn mới bên trái.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {forms.map(form => (
                <div key={form.id} className="group relative bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  
                  {/* Đường kẻ màu phân loại đơn */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      form.loaiDon === 'tam_vang' 
                        ? 'bg-gradient-to-b from-purple-500 to-pink-500' 
                        : 'bg-gradient-to-b from-orange-400 to-yellow-400'
                  }`}></div>

                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pl-2">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border tracking-wide uppercase ${
                          form.loaiDon === 'tam_vang' 
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' 
                            : 'bg-orange-500/10 text-orange-300 border-orange-500/20'
                        }`}>
                          {form.loaiDon === 'tam_vang' ? '✈ Tạm vắng' : '🏠 Tạm trú'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Gửi ngày: {formatDate(form.ngayTao)}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                          {form.diaDiem || "Không có địa điểm"}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-1 italic">
                          "{form.lyDo}"
                        </p>
                      </div>
                      
                      <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                        <span>🗓️ {formatDate(form.ngayBatDau)}</span>
                        <span className="text-gray-500">➜</span>
                        <span>🗓️ {formatDate(form.ngayKetThuc)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 min-w-[100px]">
                      {renderStatus(form.trangThai)}
                      <span className="text-[10px] font-mono text-gray-600">ID: #{form.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}