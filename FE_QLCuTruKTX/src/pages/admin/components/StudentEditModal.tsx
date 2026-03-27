import { useState, useEffect } from "react";
import axiosClient from "../../../api";
import { Student } from "../../../types/student";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onSuccess: () => void;
}

const StudentEditModal = ({ isOpen, onClose, student, onSuccess }: Props) => {
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [loading, setLoading] = useState(false);

  // Load dữ liệu ban đầu vào form
  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName,
        className: student.className,
        faculty: student.faculty,
        status: student.status,
        phone: student.phone,
        email: student.email,
        address: student.address
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Gọi API cập nhật (Admin Update)
      await axiosClient.put(`/students/${student.id}`, formData);
      
      alert("Cập nhật thành công!");
      onSuccess(); // Load lại bảng danh sách
    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-lg border border-gray-600">
        
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">✏️ Chỉnh sửa thông tin</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Họ và Tên</label>
            <input 
              name="fullName" value={formData.fullName || ""} onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-yellow-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Lớp</label>
              <input 
                name="className" value={formData.className || ""} onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Khoa</label>
              <input 
                name="faculty" value={formData.faculty || ""} onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm text-gray-400 mb-1">Số điện thoại</label>
               <input 
                 name="phone" value={formData.phone || ""} onChange={handleChange}
                 className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
               />
             </div>
             <div>
                <label className="block text-sm text-gray-400 mb-1">Trạng thái</label>
                <select 
                  name="status" value={formData.status || "active"} onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                >
                  <option value="active">Đang ở (Active)</option>
                  <option value="inactive">Ngừng ở (Inactive)</option>
                </select>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition mt-4"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentEditModal;