import { useState } from "react";
import { studentsApi } from "../../../api/students.api";
import { useAuth } from "../../../contexts/AuthContext";

export default function UpdateProfileModal({ open, onClose, student, onUpdated }: any) {
  const { user } = useAuth();
  const studentId = user?.user?.sinhVienId;

  const [form, setForm] = useState({
    email: student?.email || "",
    phone: student?.phone || "",
    address: student?.address || "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  if (!open) return null;

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setMsg("");
    if (!studentId) return setMsg("Không xác định ID sinh viên");

    setLoading(true);

    try {
      const res = await studentsApi.updateSelf(studentId, form);

      if (onUpdated) onUpdated(res.data.student);

      setMsg("Cập nhật thành công!");
      setTimeout(onClose, 700);
    } catch {
      setMsg("Có lỗi xảy ra!");
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="
        bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20
        shadow-[0_0_40px_rgba(147,51,234,0.5)] w-full max-w-md animate-fadeIn
      ">
        
        <h2 className="text-2xl font-bold text-purple-300 mb-4 text-center">
          Cập nhật thông tin
        </h2>

        {msg && (
          <p className="text-center text-pink-300 mb-3 font-medium">{msg}</p>
        )}

        {/* ===== EMAIL ===== */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 font-medium">Email</label>
          <input
            name="email"
            placeholder="Nhập email của bạn..."
            value={form.email}
            onChange={handleChange}
            className="
              w-full mt-1 p-3 rounded-lg bg-white/20 text-white 
              outline-none border border-white/10 
              focus:border-purple-400 focus:shadow-[0_0_10px_rgba(147,51,234,0.7)]
              transition
            "
          />
        </div>

        {/* ===== PHONE ===== */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 font-medium">Số điện thoại</label>
          <input
            name="phone"
            placeholder="Ví dụ: 0901234567"
            value={form.phone}
            onChange={handleChange}
            className="
              w-full mt-1 p-3 rounded-lg bg-white/20 text-white 
              outline-none border border-white/10 
              focus:border-purple-400 focus:shadow-[0_0_10px_rgba(147,51,234,0.7)]
              transition
            "
          />
        </div>

        {/* ===== ADDRESS ===== */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 font-medium">Địa chỉ</label>
          <input
            name="address"
            placeholder="Ví dụ: TP.HCM, Cần Thơ..."
            value={form.address}
            onChange={handleChange}
            className="
              w-full mt-1 p-3 rounded-lg bg-white/20 text-white 
              outline-none border border-white/10 
              focus:border-purple-400 focus:shadow-[0_0_10px_rgba(147,51,234,0.7)]
              transition
            "
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            className="
              px-5 py-2 bg-purple-600 rounded font-medium
              hover:bg-purple-700 shadow-[0_0_15px_rgba(147,51,234,0.7)]
              transition
            "
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>

      </div>
    </div>
  );
}
