import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // ✅ Gọi hàm login chuẩn xác, không còn lỗi đỏ
      await login(username, password); 
      
      // Chuyển hướng sau khi đăng nhập thành công
      // (Bạn có thể thêm logic kiểm tra role ở đây nếu muốn: admin -> /admin, user -> /user)
      navigate("/admin/dashboard"); 
      
    } catch (error) {
      alert("Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* --- CỘT TRÁI: GIỚI THIỆU --- */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              Hệ thống quản lý trực tuyến
            </div>
            
            <h1 className="text-6xl font-extrabold leading-tight">
              <span className="block text-white drop-shadow-lg">QUẢN LÝ</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
                KÝ TÚC XÁ
              </span>
            </h1>
          </div>

          <p className="text-gray-400 text-lg max-w-md leading-relaxed border-l-4 border-blue-500/50 pl-4">
            Giải pháp số hóa toàn diện quy trình cư trú, giúp sinh viên và ban quản lý kết nối dễ dàng, nhanh chóng.
          </p>

          <div className="flex gap-8 pt-4">
            <div>
              <h4 className="text-2xl font-bold text-white">1000+</h4>
              <p className="text-xs text-gray-500 uppercase">Sinh viên</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-white">500+</h4>
              <p className="text-xs text-gray-500 uppercase">Phòng ở</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-green-400">24/7</h4>
              <p className="text-xs text-gray-500 uppercase">Hỗ trợ</p>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: FORM --- */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/30 flex items-center justify-center mb-4 transform group-hover:rotate-12 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Welcome Back!</h2>
              <p className="text-gray-400 text-sm">Đăng nhập để truy cập hệ thống</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tài khoản</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Nhập MSSV hoặc Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] outline-none transition-all"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">👤</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] outline-none transition-all"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔒</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transform hover:-translate-y-1 active:scale-95 transition-all duration-200 mt-2"
              >
                {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-gray-500">
                Quên mật khẩu? <span className="text-cyan-400 hover:underline cursor-pointer">Liên hệ quản lý</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}