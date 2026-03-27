import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users2,
  FileText,
  Wrench,
  Home,
  ClipboardList,
  UserCircle2,
} from "lucide-react";

type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const adminNav: NavItem[] = [
  { label: "Tổng quan", to: "/admin", icon: LayoutDashboard },
  { label: "Quản lý phòng", to: "/admin/rooms", icon: Building2 },
  { label: "Quản lý sinh viên", to: "/admin/students", icon: Users2 },
  { label: "Quản lý hợp đồng", to: "/admin/contracts", icon: FileText },
  { label: "Bảo trì & sửa chữa", to: "/admin/maintenance", icon: Wrench },
];

const userNav: NavItem[] = [
  { label: "Phòng của tôi", to: "/my-room", icon: Home },
  { label: "Yêu cầu bảo trì", to: "/requests", icon: Wrench },
  { label: "Đơn tạm trú / tạm vắng", to: "/forms", icon: ClipboardList },
  { label: "Thông tin cá nhân", to: "/profile", icon: UserCircle2 },
];

export default function Sidebar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const navItems = isAdmin ? adminNav : userNav;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-slate-900/60 backdrop-blur-xl">
      {/* Logo section */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center font-bold text-slate-900 shadow-lg">
            KTX
          </div>

          <div>
            <p className="text-sm font-semibold">Hệ thống quản lý KTX</p>
            <p className="text-xs text-slate-400">
              {isAdmin ? "Quản trị viên" : "Sinh viên"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 text-sm">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 px-3 py-2 rounded-xl transition",
                  isActive
                    ? "bg-white/10 text-cyan-300 shadow-md"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2 text-xs text-slate-500 border-t border-white/10">
        © {new Date().getFullYear()} KTX Manager
      </div>
    </aside>
  );
}
