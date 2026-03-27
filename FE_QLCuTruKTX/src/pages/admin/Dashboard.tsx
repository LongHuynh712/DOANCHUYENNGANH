import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Calendar } from "lucide-react"; // Import thêm Icon
import { useAuth } from "../../contexts/AuthContext"; // Import AuthContext

// Dữ liệu giả lập (Sau này có API DashboardController thì thay bằng gọi API)
const MOCK_STATS = {
  totalStudents: 120,
  totalRooms: 45,
  pendingForms: 5,
  pendingMaintenance: 3,
};

const MOCK_ACTIVITIES = [
  { id: 1, user: "Nguyễn Văn A", action: "Gửi đơn xin tạm vắng", time: "10 phút trước", type: "form" },
  { id: 2, user: "Trần Thị B", action: "Báo hỏng bóng đèn", time: "30 phút trước", type: "maintenance" },
  { id: 3, user: "Lê Văn C", action: "Đã đóng tiền phòng", time: "1 giờ trước", type: "payment" },
  { id: 4, user: "Phạm Thị D", action: "Đăng ký phòng mới", time: "2 giờ trước", type: "room" },
];

export default function Dashboard() {
  const [stats] = useState(MOCK_STATS);
  const [, setLoading] = useState(false);
  
  // Lấy hàm logout từ Context
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
        logout();
        navigate("/auth/login");
    }
  };

  // Giả lập loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div className="p-6 text-white max-w-7xl mx-auto space-y-8">
      
      {/* --- HEADER: LỜI CHÀO & NÚT LOGOUT --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Dashboard Tổng quan
          </h1>
          <p className="text-gray-400 mt-1">Xin chào Admin, chúc bạn một ngày làm việc hiệu quả!</p>
        </div>
        
        <div className="flex gap-3">
            {/* Hiển thị ngày tháng */}
            <span className="px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-sm text-gray-400 flex items-center gap-2">
                <Calendar size={16} /> 
                {new Date().toLocaleDateString('vi-VN')}
            </span>

            {/* 🔥 NÚT ĐĂNG XUẤT (MỚI) */}
            <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
            >
                <LogOut size={16} /> Đăng xuất
            </button>
        </div>
      </div>

      {/* --- PHẦN 1: THẺ THỐNG KÊ (STATS CARDS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Sinh viên */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-lg hover:border-blue-500/50 transition duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Tổng sinh viên</p>
              <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition">
                {stats.totalStudents}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition">
              👥
            </div>
          </div>
          <div className="mt-4 text-xs text-green-400 flex items-center gap-1">
            <span>↑ 12%</span>
            <span className="text-gray-500">so với tháng trước</span>
          </div>
        </div>

        {/* Card 2: Phòng */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-lg hover:border-purple-500/50 transition duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Tổng số phòng</p>
              <h3 className="text-3xl font-bold text-white group-hover:text-purple-400 transition">
                {stats.totalRooms}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition">
              🏢
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
            <span className="text-yellow-400">85%</span>
            <span>tỷ lệ lấp đầy</span>
          </div>
        </div>

        {/* Card 3: Đơn từ */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-lg hover:border-yellow-500/50 transition duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Đơn chờ duyệt</p>
              <h3 className="text-3xl font-bold text-white group-hover:text-yellow-400 transition">
                {stats.pendingForms}
              </h3>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition">
              📝
            </div>
          </div>
          <Link to="/admin/forms" className="mt-4 text-xs text-blue-400 hover:underline block">
            Xem danh sách →
          </Link>
        </div>

        {/* Card 4: Báo hỏng */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-lg hover:border-red-500/50 transition duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Yêu cầu sửa chữa</p>
              <h3 className="text-3xl font-bold text-white group-hover:text-red-400 transition">
                {stats.pendingMaintenance}
              </h3>
            </div>
            <div className="p-3 bg-red-500/20 rounded-xl text-red-400 group-hover:bg-red-500 group-hover:text-white transition">
              🛠️
            </div>
          </div>
          <Link to="/admin/maintenance" className="mt-4 text-xs text-blue-400 hover:underline block">
            Xử lý ngay →
          </Link>
        </div>
      </div>

      {/* --- PHẦN 2: LAYOUT CHÍNH --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: HOẠT ĐỘNG GẦN ĐÂY */}
        <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-white/10 p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            Hoạt động gần đây
          </h2>
          
          <div className="space-y-4">
            {MOCK_ACTIVITIES.map((act) => (
              <div key={act.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl hover:bg-gray-800 transition cursor-default group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                      act.type === 'form' ? 'bg-yellow-500' : 
                      act.type === 'maintenance' ? 'bg-red-500' :
                      act.type === 'payment' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {act.user.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-blue-400 transition">{act.user}</h4>
                    <p className="text-sm text-gray-400">{act.action}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded bg-black/20">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: TRUY CẬP NHANH */}
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 shadow-xl border border-white/10">
          <h2 className="text-xl font-bold mb-6 text-white">Truy cập nhanh</h2>
          
          <div className="grid grid-cols-1 gap-3">
            <Link to="/admin/students" className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition backdrop-blur-sm">
              <span className="text-2xl">🎓</span>
              <div>
                <h4 className="font-bold">Quản lý Sinh viên</h4>
                <p className="text-xs text-blue-200">Thêm, sửa, xóa hồ sơ</p>
              </div>
            </Link>

            <Link to="/admin/rooms" className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition backdrop-blur-sm">
              <span className="text-2xl">🏢</span>
              <div>
                <h4 className="font-bold">Sơ đồ phòng</h4>
                <p className="text-xs text-blue-200">Quản lý xếp phòng</p>
              </div>
            </Link>

            <Link to="/admin/maintenance" className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition backdrop-blur-sm">
              <span className="text-2xl">🔧</span>
              <div>
                <h4 className="font-bold">Bảo trì</h4>
                <p className="text-xs text-blue-200">Xem yêu cầu sửa chữa</p>
              </div>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="font-bold mb-2">Hệ thống</h3>
            <div className="flex justify-between text-sm text-blue-200">
              <span>Trạng thái Server</span>
              <span className="text-green-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}