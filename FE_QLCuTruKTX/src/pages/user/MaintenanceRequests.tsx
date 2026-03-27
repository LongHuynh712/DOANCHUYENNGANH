import { useEffect, useState } from "react";
import axiosClient from "../../api";

// 1. Định nghĩa kiểu dữ liệu
interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  status: number; // 0:Pending, 1:InProgress, 2:Completed, 3:Approved, 4:Rejected
  createdAt: string;
}

export default function MaintenanceRequests() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State cho form
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  // 2. Hàm tải danh sách
  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get<MaintenanceRequest[]>("/maintenance");
      setRequests(res.data);
    } catch (error) {
      console.error("Lỗi tải yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  // 3. Xử lý Gửi yêu cầu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    try {
      setSubmitting(true);
      await axiosClient.post("/maintenance", formData);
      
      // Reset form & reload
      setFormData({ title: "", description: "" });
      await fetchMyRequests();
      alert("Gửi yêu cầu thành công!");
    } catch (error) {
      alert("Gửi thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Helper: Render trạng thái "Xịn"
  const renderStatus = (status: number) => {
    switch (status) {
      case 0: // Pending
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span> Chờ xử lý
          </span>
        );
      case 1: // InProgress
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-spin"></span> Đang sửa
          </span>
        );
      case 3: // Approved
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Đã duyệt
          </span>
        );
      case 2: // Completed
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
            <span className="text-sm">✓</span> Hoàn thành
          </span>
        );
      case 4: // Rejected
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <span className="text-sm">✕</span> Từ chối
          </span>
        );
      default:
        return <span className="text-gray-500 text-xs">...</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN", {
      hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric"
    });
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor (Hiệu ứng nền mờ ảo) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI: FORM GỬI YÊU CẦU (GLASSMORPHISM) --- */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <span className="text-2xl">🔧</span>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Báo hỏng
                </h2>
                <p className="text-xs text-gray-400 font-medium">Gửi yêu cầu sửa chữa thiết bị</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tiêu đề sự cố</label>
                <div className="relative group">
                  <input 
                    type="text"
                    required
                    placeholder="VD: Bóng đèn bị cháy..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all group-hover:border-white/20"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mô tả chi tiết</label>
                <div className="relative group">
                  <textarea 
                    rows={5}
                    required
                    placeholder="Mô tả kỹ hơn về tình trạng hư hỏng để thợ dễ hình dung..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none group-hover:border-white/20"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {submitting ? (
                  <>Processing...</>
                ) : (
                  <>🚀 Gửi yêu cầu ngay</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* --- CỘT PHẢI: DANH SÁCH (CARDS WITH ANIMATION) --- */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-yellow-400">📜</span> Lịch sử gửi
            </h2>
            <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
              Tổng số: <strong className="text-white">{requests.length}</strong>
            </span>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>)}
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white/5 backdrop-blur-md rounded-2xl border border-dashed border-white/10 text-gray-400">
              <span className="text-6xl mb-4 opacity-50">✨</span>
              <p className="text-lg">Bạn chưa gửi yêu cầu nào.</p>
              <p className="text-sm opacity-60">Các yêu cầu sửa chữa sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((req) => (
                <div 
                  key={req.id} 
                  className="group relative bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Decorative Gradient Line on Hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pl-2">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                          {req.title}
                        </h3>
                        <span className="text-[10px] font-mono text-gray-500 bg-black/30 px-2 py-0.5 rounded border border-white/5">
                          #{req.id}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                        {req.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                        <span>🕒</span>
                        <span>{formatDate(req.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 min-w-[120px]">
                      {renderStatus(req.status)}
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