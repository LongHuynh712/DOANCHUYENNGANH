import { useEffect, useState } from "react";
import axiosClient from "../../api";
import { Trash2, Bell, Plus, Calendar, Send, FileText, AlertCircle } from "lucide-react";

interface NewsItem { id: number; title: string; content: string; createdAt: string; }

export default function NewsManagement() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // State form
  const [formData, setFormData] = useState({ title: "", content: "" });

  const fetchNews = async () => {
    try {
      const res = await axiosClient.get<NewsItem[]>("/news");
      setNewsList(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      setSubmitting(true);
      await axiosClient.post("/news", formData);
      setFormData({ title: "", content: "" });
      await fetchNews();
      alert("Đăng thông báo thành công!");
    } catch (error) {
      alert("Lỗi khi đăng bài.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa thông báo này? Hành động không thể hoàn tác.")) {
      try {
        await axiosClient.delete(`/news/${id}`);
        setNewsList(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        alert("Xóa thất bại.");
      }
    }
  };

  return (
    <div className="p-6 text-white max-w-[1600px] mx-auto min-h-screen">
      
      {/* Header Page */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-3">
          <Bell className="text-cyan-400" /> Quản lý Tin tức & Thông báo
        </h1>
        <p className="text-gray-400 text-sm mt-2 ml-1">Đăng tải thông báo quan trọng đến toàn thể sinh viên KTX</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI: FORM ĐĂNG BÀI (STICKY) --- */}
        <div className="lg:col-span-1">
          <div className="bg-[#1e293b]/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.1)] sticky top-6">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <Plus size={20}/>
              </div>
              <h2 className="text-lg font-bold text-white">Tạo thông báo mới</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase font-bold ml-1 flex items-center gap-1">
                  <FileText size={12} /> Tiêu đề
                </label>
                <input 
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all hover:bg-black/30" 
                  placeholder="VD: Thông báo cúp nước ngày 20/10..." 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase font-bold ml-1 flex items-center gap-1">
                  <FileText size={12} /> Nội dung chi tiết
                </label>
                <textarea 
                  rows={8} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all hover:bg-black/30 resize-none" 
                  placeholder="Nhập nội dung đầy đủ..." 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  disabled={submitting}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting || !formData.title || !formData.content}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 transform active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="animate-pulse">Đang đăng...</span>
                ) : (
                  <>
                    <Send size={18} /> Đăng ngay
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* --- CỘT PHẢI: DANH SÁCH (GRID CARDS) --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-cyan-500 rounded-full"></span>
              Danh sách đã đăng
            </h2>
            <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-gray-400 border border-white/5">
              Tổng số: {newsList.length}
            </span>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1,2,3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse"></div>)}
            </div>
          ) : newsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-[#1e293b]/40 border border-dashed border-white/10 rounded-2xl text-gray-500">
              <AlertCircle size={48} className="mb-4 opacity-50" />
              <p>Chưa có thông báo nào được đăng.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {newsList.map(item => (
                <div 
                  key={item.id} 
                  className="group relative bg-[#1e293b]/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-[#1e293b]/80 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  {/* Decorative Gradient Line */}
                  <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20 flex items-center gap-1">
                          <Calendar size={12}/> {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(item.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line border-l-2 border-white/5 pl-3 mt-2">
                        {item.content}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-50 group-hover:opacity-100"
                      title="Xóa thông báo"
                    >
                      <Trash2 size={20} />
                    </button>
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