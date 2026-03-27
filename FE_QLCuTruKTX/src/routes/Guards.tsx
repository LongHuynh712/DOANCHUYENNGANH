import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  allowedRoles?: string[]; // Mảng chứa các role được phép (VD: ['admin'])
}

export const RequireAuth = ({ allowedRoles }: Props) => {
  const { user, isAuthenticated } = useAuth();

  // 1. Chưa đăng nhập -> Đá về Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2. Lấy role hiện tại (Chuyển về chữ thường để so sánh cho chắc)
  // Lưu ý: Kiểm tra xem backend trả về user.role hay user.user.role
  const currentRole = (user.user?.role || "").toLowerCase(); 

  // 3. Kiểm tra quyền (Nếu route yêu cầu role cụ thể)
  if (allowedRoles && allowedRoles.length > 0) {
    // Nếu role của user KHÔNG nằm trong danh sách cho phép
    // Ví dụ: user là 'user' mà allowedRoles là ['admin']
    if (!allowedRoles.includes(currentRole)) {
      
      // Nếu là admin đi nhầm vào trang user -> Cho về Dashboard admin
      if (currentRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
      
      // Nếu là user đi nhầm vào trang admin -> Cho về trang user (profile)
      if (currentRole === 'user') return <Navigate to="/user/profile" replace />;
      
      // Hoặc đá về trang 403 Forbidden
      return <Navigate to="/auth/login" replace />;
    }
  }

  // 4. Hợp lệ -> Cho đi tiếp
  return <Outlet />;
};