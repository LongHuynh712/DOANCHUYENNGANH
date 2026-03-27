import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import AdminLayout from "../layout/AdminLayout";
import UserLayout from "../layout/UserLayout";

// Import các trang Admin
import Dashboard from "../pages/admin/Dashboard";
import StudentManagement from "../pages/admin/StudentManagement";
import FormsManagement from "../pages/admin/FormsManagement";
import MaintenanceManagement from "../pages/admin/MaintenanceManagement";
import RoomManagement from "../pages/admin/RoomManagement";
import NewsManagement from "../pages/admin/NewsManagement";
import AttendanceCheck from "../pages/admin/AttendanceCheck";
import AdminSupportChat from "../pages/admin/SupportChat"; // 🔥 Import trang Chat Admin

// Import các trang User
import UserProfile from "../pages/user/Profile";
import ResidenceForms from "../pages/user/ResidenceForms";
import MaintenanceRequests from "../pages/user/MaintenanceRequests";
import StudentNews from "../pages/user/StudentNews";
import StudentAttendance from "../pages/user/StudentAttendance"; 

// Import Guard bảo vệ
import { RequireAuth } from "./Guards";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Route Công khai */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/auth/login" />} />

      {/* 2. KHU VỰC ADMIN */}
      <Route element={<RequireAuth allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="forms" element={<FormsManagement />} />
          <Route path="maintenance" element={<MaintenanceManagement />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="attendance" element={<AttendanceCheck />} />
          
          {/* 🔥 Route Chat Admin */}
          <Route path="chat" element={<AdminSupportChat />} />
        </Route>
      </Route>

      {/* 3. KHU VỰC SINH VIÊN */}
      <Route element={<RequireAuth allowedRoles={["user"]} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="forms" element={<ResidenceForms />} />
          <Route path="maintenance" element={<MaintenanceRequests />} />
          <Route path="news" element={<StudentNews />} />
          <Route path="attendance" element={<StudentAttendance />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
}