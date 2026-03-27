import { useState } from "react";
import axiosClient from "../api";
import { X, Save, UserPlus } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateStudentModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    studentId: "", fullName: "", dateOfBirth: "", gender: "Nam",
    phone: "", email: "", className: "", faculty: "", idCard: "", address: ""
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post("/students", formData);
      alert("✅ Thêm thành công!\nTài khoản: " + formData.studentId + "\nMật khẩu: 123456");
      onSuccess();
      onClose();
      setFormData({
        studentId: "", fullName: "", dateOfBirth: "", gender: "Nam",
        phone: "", email: "", className: "", faculty: "", idCard: "", address: ""
      });
    } catch (error: any) {
      alert("❌ Lỗi: " + (error.response?.data || "Có lỗi xảy ra"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#1e293b] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserPlus size={24} /> Thêm sinh viên mới
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition"><X size={24} /></button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-white max-h-[80vh] overflow-y-auto">
          <div className="md:col-span-2 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 text-sm text-blue-200 mb-2">
            ℹ️ Hệ thống sẽ tự động tạo tài khoản: <b>Username = MSSV</b>, <b>Pass = 123456</b>.
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold uppercase">Mã số SV (*)</label>
            <input name="studentId" required className="w-full bg-[#0f172a] border border-gray-600 rounded-lg p-2.5 focus:border-blue-500 outline-none" placeholder="VD: SV001" value={formData.studentId} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold uppercase">Họ và tên (*)</label>
            <input name="fullName" required className="w-full bg-[#0f172a] border border-gray-600 rounded-lg p-2.5 focus:border-blue-500 outline-none" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold uppercase">Ngày sinh</label>
            <input type="date" name="dateOfBirth" required className="w-full bg-[#0f172a] border border-gray-600 rounded-lg p-2.5 focus:border-blue-500 outline-none text-white" value={formData.dateOfBirth} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold uppercase">Giới tính</label>
            <select name="gender" className="w-full bg-[#0f172a] border border-gray-600 rounded-lg p-2.5 focus:border-blue-500 outline-none text-white" value={formData.gender} onChange={handleChange}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold uppercase">Lớp</label>
            <input name="className" className="w-full bg-[#0f172a] border border-gray-600 rounded-lg p-2.5 focus:border-blue-500 outline-none" placeholder="Lớp..." value={formData.className} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold uppercase">Khoa</label>
            <input name="faculty" className="w-full bg-[#0f172a] border border-gray-600 rounded-lg p-2.5 focus:border-blue-500 outline-none" placeholder="CNTT..." value={formData.faculty} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold uppercase">Email</label>
            <input type="email" name="email" className="w-full bg-[#0f172a] border border-gray-600 rounded-lg p-2.5 focus:border-blue-500 outline-none" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold uppercase">SĐT</label>
            <input name="phone" className="w-full bg-[#0f172a] border border-gray-600 rounded-lg p-2.5 focus:border-blue-500 outline-none" placeholder="090..." value={formData.phone} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold uppercase">CCCD</label>
            <input name="idCard" className="w-full bg-[#0f172a] border border-gray-600 rounded-lg p-2.5 focus:border-blue-500 outline-none" placeholder="Số CCCD..." value={formData.idCard} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold uppercase">Quê quán</label>
            <input name="address" className="w-full bg-[#0f172a] border border-gray-600 rounded-lg p-2.5 focus:border-blue-500 outline-none" placeholder="Tỉnh/TP..." value={formData.address} onChange={handleChange} />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10 transition">Hủy bỏ</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg flex items-center gap-2 transition disabled:opacity-50">
              {loading ? "Đang lưu..." : <><Save size={18} /> Lưu sinh viên</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}