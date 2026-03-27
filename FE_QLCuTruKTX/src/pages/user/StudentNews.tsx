import { useEffect, useState } from "react";
import axiosClient from "../../api";
import { Bell, Calendar, Clock, Newspaper, ChevronRight } from "lucide-react";

interface NewsItem { id: number; title: string; content: string; createdAt: string; }

export default function StudentNews() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axiosClient.get<NewsItem[]>("/news");
        setNewsList(res.data);
      } catch (error) {
        console.error("Lỗi tải tin tức:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen text-white relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl mb-4 shadow-lg backdrop-blur-md border border-yellow-500/30">
          <Bell size={32} className="text-yellow-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-200 via-orange-400 to-red-400 bg-clip-text text-transparent mb-3">
          Bảng Tin Ký Túc Xá
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Cập nhật những thông báo mới nhất, sự kiện và tin tức quan trọng từ Ban Quản Lý.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-white/5 rounded-3xl"></div>)}
        </div>
      ) : newsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white/5 border border-white/10 rounded-3xl text-gray-500 backdrop-blur-md">
          <Newspaper size={64} className="mb-4 opacity-50" />
          <p className="text-xl font-medium">Hiện chưa có thông báo nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((item, index) => (
            <div 
              key={item.id} 
              className="group relative bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-[#1e293b]/80 hover:border-blue-500/30 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }} // Hiệu ứng xuất hiện lần lượt
            >
              {/* Sticker "Mới" cho tin đăng trong vòng 3 ngày */}
              {(new Date().getTime() - new Date(item.createdAt).getTime()) < 3 * 24 * 60 * 60 * 1000 && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg animate-pulse">
                  Mới
                </div>
              )}

              {/* Icon trang trí */}
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                <Newspaper size={24} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors h-[3.5rem]">
                {item.title}
              </h3>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 border-b border-white/5 pb-4">
                <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded">
                  <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} /> {new Date(item.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>

              {/* Content Snippet */}
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 flex-1 mb-4">
                {item.content}
              </p>

              {/* Footer "Đọc thêm" (Optional - nếu sau này làm trang chi tiết) */}
              <div className="flex items-center text-blue-400 text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform cursor-pointer">
                Chi tiết <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}