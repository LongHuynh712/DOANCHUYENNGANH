import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api"; // Import axios đã cấu hình của bạn

type UserRole = "admin" | "user";

// Định nghĩa dữ liệu trả về từ Backend
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: UserRole;
    sinhVienId?: number;
  };
}

// Định nghĩa các hàm trong Context
interface AuthContextType {
  user: LoginResponse | null;
  // SỬA: login nhận username, password và trả về Promise
  login: (username: string, password: string) => Promise<void>; 
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);

  // 1. Load lại user từ localStorage khi F5 trang
  useEffect(() => {
    const saved = localStorage.getItem("auth");
    const token = localStorage.getItem("token");
    
    if (saved && token) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch (e) {
        // Nếu json lỗi thì xóa sạch
        localStorage.clear();
      }
    }
  }, []);

  // 2. Hàm Login: Gọi API -> Lưu Token -> Set State
  const login = async (username: string, password: string) => {
    try {
      // Gọi API Backend
      const res = await axiosClient.post<LoginResponse>("/auth/login", { 
        username, 
        password 
      });

      const data = res.data;

      // Lưu thông tin user và token
      setUser(data);
      localStorage.setItem("auth", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      
      // Quan trọng: Set header mặc định cho các request sau này
      // (Tùy vào cách bạn cấu hình axiosClient, dòng này có thể không cần nếu dùng Interceptor)
      
    } catch (error) {
      console.error("Login Error:", error);
      throw error; // Ném lỗi ra để trang Login.tsx bắt được và hiện Alert
    }
  };

  // 3. Hàm Logout: Xóa hết
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    // Chuyển hướng về trang login
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};