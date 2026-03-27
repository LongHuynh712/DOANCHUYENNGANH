export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e0e1a] text-white">
      {/* ===== HERO ===== */}
      <div className="flex flex-col items-center text-center pt-24 pb-32 relative">
        
        {/* Glow Background */}
        <div className="absolute top-20 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-0 right-20 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[180px]"></div>

        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
          Ký túc xá Sinh viên
        </h1>

        <p className="mt-6 text-lg text-white/70 max-w-2xl">
          Hệ thống quản lý cư trú hiện đại – hỗ trợ sinh viên đăng ký nội trú, xem thông tin phòng,
          gửi yêu cầu bảo trì và theo dõi trạng thái trực tuyến.
        </p>

        <div className="mt-10 flex gap-4">
          <a
            href="/auth/login"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Đăng nhập
          </a>
          <a
            href="/auth/register"
            className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold hover:bg-white/20 transition"
          >
            Tạo tài khoản
          </a>
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-8 pb-28">

        {/* Card 1 */}
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-md hover:shadow-purple-500/30 transition">
          <h3 className="text-xl font-bold text-purple-300 mb-3">Quản lý phòng</h3>
          <p className="text-white/70">
            Xem phòng trống, số lượng sinh viên trong phòng, và tình trạng sử dụng theo thời gian thực.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-md hover:shadow-pink-400/30 transition">
          <h3 className="text-xl font-bold text-pink-300 mb-3">Quản lý sinh viên</h3>
          <p className="text-white/70">
            Theo dõi thông tin nội trú, hợp đồng, lịch sử phòng ở, và yêu cầu hỗ trợ.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-md hover:shadow-blue-400/30 transition">
          <h3 className="text-xl font-bold text-blue-300 mb-3">Yêu cầu bảo trì</h3>
          <p className="text-white/70">
            Sinh viên có thể gửi yêu cầu bảo trì và theo dõi tiến trình xử lý nhanh chóng.
          </p>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="py-6 border-t border-white/10 text-center text-white/40">
        © 2025 Hệ thống Ký túc xá Sinh viên – Thiết kế bởi bạn.
      </footer>
    </div>
  );
}
