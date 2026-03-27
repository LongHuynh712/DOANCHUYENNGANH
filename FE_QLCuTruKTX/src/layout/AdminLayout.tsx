import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  Home,
  LogOut,
  Bell,
  ClipboardCheck,
  MessageSquare // 🔥 Import icon MessageSquare
} from "lucide-react";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition
     ${isActive ? "bg-blue-600 text-white shadow" : "hover:bg-slate-700 text-white/80"}`;

  return (
    <div className="flex h-screen bg-[#0f172a] text-white font-sans">

      <aside className="w-64 bg-slate-900 border-r border-white/10 p-5 flex flex-col">
        <Link to="/admin/dashboard" className="block mb-8 group cursor-pointer">
           <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
             Admin Panel
           </h2>
           <p className="text-xs text-gray-500 group-hover:text-gray-400">Quản lý Ký túc xá</p>
        </Link>

        <nav className="space-y-2 flex-1">
          <NavLink to="/admin/dashboard" className={linkClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          
          <NavLink to="/admin/attendance" className={linkClass}>
            <ClipboardCheck size={18} /> Điểm danh
          </NavLink>

          {/* 🔥 MENU CHAT HỖ TRỢ */}
          <NavLink to="/admin/chat" className={linkClass}>
            <MessageSquare size={18} /> Hỗ trợ trực tuyến
          </NavLink>

          <NavLink to="/admin/news" className={linkClass}>
            <Bell size={18} /> Quản lý thông báo
          </NavLink>
          <NavLink to="/admin/students" className={linkClass}>
            <Users size={18} /> Quản lý sinh viên
          </NavLink>
          <NavLink to="/admin/forms" className={linkClass}>
            <FileText size={18} /> Quản lý đơn
          </NavLink>
          <NavLink to="/admin/maintenance" className={linkClass}>
            <Wrench size={18} /> Bảo trì & sửa chữa
          </NavLink>
          <NavLink to="/admin/rooms" className={linkClass}>
            <Home size={18} /> Quản lý phòng
          </NavLink>
        </nav>

        <div className="mt-auto pt-4 border-t border-white/10 text-[10px] text-gray-600 text-center">
          © 2025 KTX Manager
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-slate-900 border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-20">
          <Link 
            to="/admin/dashboard" 
            className="text-white/70 text-sm hover:text-white transition-colors cursor-pointer flex items-center gap-2 font-medium"
            title="Về trang chủ"
          >
             <Home size={16} className="mb-0.5" /> 
             Hệ thống quản lý KTX
          </Link>

          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-red-500/20">
            <LogOut size={16} /> <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </header>

        <main className="flex-1 p-6 overflow-auto bg-[#0f172a] relative scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}