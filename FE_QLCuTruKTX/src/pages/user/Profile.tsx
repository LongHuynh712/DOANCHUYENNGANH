import { useEffect, useState } from "react";
import axiosClient from "../../api";

interface StudentProfile {
  id: number;
  studentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  phone?: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  className: string;
  major: string;
  status: string;
  avatarUrl?: string;
  faculty?: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<StudentProfile>>({});

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await axiosClient.get<StudentProfile>("/students/profile");
        setProfile(res.data);
        setFormData({
          ...res.data,
          phoneNumber: res.data.phoneNumber || res.data.phone || ""
        });
      } catch (error) {
        console.error("Lỗi tải profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSubmitting(true);
      await axiosClient.put("/students/profile", {
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
      });
      setProfile({ ...profile!, ...formData });
      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (error) {
      alert("Lỗi cập nhật.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Đang tải...</div>;
  if (!profile) return <div className="p-8 text-center text-gray-400">Không có dữ liệu.</div>;

  const isActive = (profile.status || "").toLowerCase() === 'active';

  return (
    // SỬA: Bỏ 'min-h-screen', dùng 'w-full' và 'pb-20' để tránh tràn đáy
    <div className="w-full text-white p-4 md:p-8 relative font-sans pb-24">
      
      {/* Background Effects (Giữ nguyên nhưng đảm bảo không gây scroll ngang) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- 1. HEADER HERO CARD --- */}
        <div className="relative group rounded-3xl overflow-hidden shadow-xl border border-white/10 bg-[#1e293b]/50 backdrop-blur-md">
            {/* Banner Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-purple-900/80 opacity-90"></div>
            
            <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-br from-blue-400 to-purple-500 shadow-xl">
                        <img 
                            src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.fullName}&background=0f172a&color=38bdf8`} 
                            alt="Avatar" 
                            className="w-full h-full rounded-full object-cover border-4 border-[#0f172a]"
                        />
                    </div>
                    <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-[#0f172a] ${isActive ? 'bg-green-400' : 'bg-red-500'}`}></div>
                </div>

                {/* Info Text */}
                <div className="flex-1 text-center md:text-left space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        {profile.fullName}
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm">
                        <span className="px-3 py-1 bg-black/20 rounded-full text-blue-200 font-mono border border-white/5">
                            {profile.studentId}
                        </span>
                        <span className={`px-3 py-1 rounded-full font-bold text-xs flex items-center border ${
                            isActive 
                                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                            {isActive ? 'HOẠT ĐỘNG' : 'KHÔNG HOẠT ĐỘNG'}
                        </span>
                    </div>
                </div>

                {/* Edit Toggle Button */}
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-5 py-2 rounded-xl font-bold transition-all shadow-md text-sm flex items-center gap-2 ${
                        isEditing 
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                >
                    {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                </button>
            </div>
        </div>

        {/* --- 2. CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* CỘT TRÁI: THÔNG TIN HỌC VẤN */}
            <div className="lg:col-span-1">
                <div className="bg-[#1e293b]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg h-full">
                    <h3 className="text-lg font-bold text-blue-400 mb-5 flex items-center gap-2 border-b border-white/5 pb-3">
                        🎓 Học vấn
                    </h3>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Lớp</label>
                            <div className="text-base text-white font-medium">{profile.className || "—"}</div>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Ngành</label>
                            <div className="text-base text-white font-medium">{profile.major || "—"}</div>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Khoa</label>
                            <div className="text-base text-white font-medium">{profile.faculty || "CNTT"}</div>
                        </div>
                        <div className="pt-2">
                            <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/5">Niên khóa: 2021-2025</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN CÁ NHÂN */}
            <div className="lg:col-span-2">
                <div className="bg-[#1e293b]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg relative h-full">
                    <h3 className="text-lg font-bold text-purple-400 mb-5 flex items-center gap-2 border-b border-white/5 pb-3">
                        👤 Thông tin cá nhân
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Giới tính</label>
                            <div className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2.5 text-gray-300 text-sm">
                                {profile.gender || "—"}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Ngày sinh</label>
                            <div className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2.5 text-gray-300 text-sm">
                                {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('vi-VN') : "—"}
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Email</label>
                            <input 
                                name="email"
                                disabled={!isEditing}
                                value={formData.email || ""}
                                onChange={handleChange}
                                className={`w-full rounded-lg px-3 py-2.5 outline-none transition-all text-sm ${
                                    isEditing 
                                        ? 'bg-black/40 border border-blue-500/50 text-white focus:shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                                        : 'bg-transparent border border-transparent text-gray-300'
                                }`}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Số điện thoại</label>
                            <input 
                                name="phoneNumber"
                                disabled={!isEditing}
                                value={formData.phoneNumber || ""}
                                onChange={handleChange}
                                className={`w-full rounded-lg px-3 py-2.5 outline-none transition-all text-sm ${
                                    isEditing 
                                        ? 'bg-black/40 border border-blue-500/50 text-white focus:shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                                        : 'bg-transparent border border-transparent text-gray-300'
                                }`}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs text-gray-400 ml-1">Địa chỉ</label>
                            <input 
                                name="address"
                                disabled={!isEditing}
                                value={formData.address || ""}
                                onChange={handleChange}
                                className={`w-full rounded-lg px-3 py-2.5 outline-none transition-all text-sm ${
                                    isEditing 
                                        ? 'bg-black/40 border border-blue-500/50 text-white focus:shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                                        : 'bg-transparent border border-transparent text-gray-300'
                                }`}
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-6 flex justify-end animate-fade-in-up border-t border-white/5 pt-4">
                            <button 
                                onClick={handleSave}
                                disabled={submitting}
                                className="px-6 py-2 rounded-lg font-bold text-white shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transform active:scale-95 transition-all text-sm"
                            >
                                {submitting ? "Đang lưu..." : "💾 Lưu thay đổi"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}