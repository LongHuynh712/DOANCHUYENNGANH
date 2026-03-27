import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SupportChat from "../pages/user/SupportChat"; // 🔥 Import Widget Chat
import { 
  LogOut, 
  User, 
  FileText, 
  Wrench,
  Bell,
  ClipboardCheck 
} from "lucide-react";

export default function UserLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm
     ${isActive 
       ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
       : "text-gray-400 hover:bg-white/10 hover:text-white"}`;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="h-16 bg-[#1e293b]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              KTX Portal
            </h1>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center gap-2">
              <NavLink to="/user/profile" className={linkClass}>
                <User size={18} /> Hồ sơ
              </NavLink>
              
              <NavLink to="/user/news" className={linkClass}>
                <Bell size={18} /> Thông báo
              </NavLink>

              <NavLink to="/user/forms" className={linkClass}>
                <FileText size={18} /> Đơn từ
              </NavLink>
              
              <NavLink to="/user/attendance" className={linkClass}>
                <ClipboardCheck size={18} /> Điểm danh
              </NavLink>

              <NavLink to="/user/maintenance" className={linkClass}>
                <Wrench size={18} /> Báo hỏng
              </NavLink>
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-lg transition-all text-sm font-bold shadow-md hover:shadow-red-500/20"
          >
            <LogOut size={16} /> 
            <span className="hidden sm:inline">Thoát</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 animate-fade-in relative">
        <Outlet />
        
        {/* 🔥 WIDGET CHAT NẰM Ở ĐÂY (Hiện ở mọi trang User) */}
        <SupportChat />
      </main>

      {/* Menu Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-white/10 p-3 flex justify-around items-center z-50 pb-safe">
        <NavLink to="/user/profile" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-blue-400" : "text-gray-500"}`}>
          <User size={20} /> Hồ sơ
        </NavLink>
        <NavLink to="/user/news" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-blue-400" : "text-gray-500"}`}>
          <Bell size={20} /> News
        </NavLink>
        <NavLink to="/user/attendance" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-blue-400" : "text-gray-500"}`}>
          <ClipboardCheck size={20} /> Đ.Danh
        </NavLink>
        <NavLink to="/user/forms" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-blue-400" : "text-gray-500"}`}>
          <FileText size={20} /> Đơn
        </NavLink>
        <NavLink to="/user/maintenance" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-blue-400" : "text-gray-500"}`}>
          <Wrench size={20} /> Sửa
        </NavLink>
      </nav>

    </div>
  );
}