import { useState } from "react";
import { studentsApi } from "../api/students.api";

export default function ChangePasswordModal({ open, onClose, studentId }: any) {
  if (!open) return null;

  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirmPassword, setConfirm] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError("Không được để trống.");
    }
    if (newPassword !== confirmPassword) {
      return setError("Mật khẩu xác nhận không trùng.");
    }
    if (newPassword.length < 6) {
      return setError("Mật khẩu phải từ 6 ký tự trở lên.");
    }

    try {
      await studentsApi.changePassword(studentId, {
        oldPassword,
        newPassword,
      });

      alert("Đổi mật khẩu thành công!");
      onClose();
    } catch (err: any) {
      setError(err.response?.data || "Lỗi đổi mật khẩu");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
                    backdrop-blur-md bg-black/40 animate-fadeIn">

      <div className="w-[380px] p-6 rounded-2xl 
                    bg-white/10 border border-purple-500/40 
                    shadow-[0_0_30px_rgba(168,85,247,0.4)]
                    animate-scaleIn">

        <h2 className="text-xl font-bold mb-4 text-purple-300">Đổi mật khẩu</h2>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <label>Mật khẩu cũ</label>
        <input
          type="password"
          className="inputBox"
          value={oldPassword}
          onChange={(e) => setOld(e.target.value)}
        />

        <label>Mật khẩu mới</label>
        <input
          type="password"
          className="inputBox"
          value={newPassword}
          onChange={(e) => setNew(e.target.value)}
        />

        <label>Xác nhận mật khẩu</label>
        <input
          type="password"
          className="inputBox"
          value={confirmPassword}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-5">
          <button className="btnCancel" onClick={onClose}>
            Hủy
          </button>
          <button className="btnPrimary" onClick={handleSubmit}>
            Lưu
          </button>
        </div>
      </div>

      <style>{`
        .inputBox {
          width: 100%;
          padding: 10px;
          margin-top: 4px;
          margin-bottom: 12px;
          border-radius: 8px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
        }

        .btnCancel {
          padding: 8px 16px;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
        }

        .btnPrimary {
          padding: 8px 16px;
          background: linear-gradient(90deg, #a855f7, #ec4899);
          border-radius: 8px;
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        @keyframes scaleIn {
          from { transform: scale(0.85); opacity: 0 }
          to { transform: scale(1); opacity: 1 }
        }
      `}</style>
    </div>
  );
}
