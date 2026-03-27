import { Student } from "../../../types/student";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

const StudentDetailModal = ({ isOpen, onClose, student }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="text-2xl">🎓</span> Hồ sơ sinh viên
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">&times;</button>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cột trái: Avatar & Info cơ bản */}
          <div className="col-span-1 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden mb-4 shadow-lg bg-white">
               <img 
                 src={student.avatarUrl || `https://ui-avatars.com/api/?name=${student.fullName}&background=random`} 
                 alt="Avatar" 
                 className="w-full h-full object-cover"
               />
            </div>
            <h3 className="text-lg font-bold text-white">{student.fullName}</h3>
            <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-mono mt-2">
              {student.studentId}
            </span>
            <div className="mt-4 w-full">
              <span className={`block w-full px-3 py-1 rounded text-sm font-bold border ${
                (student.status || "").toLowerCase() === 'active' 
                  ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>
                {(student.status || "").toLowerCase() === 'active' ? '● Đang cư trú' : '● Ngừng cư trú'}
              </span>
            </div>
          </div>

          {/* Cột phải: Chi tiết */}
          <div className="col-span-2 space-y-4 text-sm text-gray-300">
            <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5 space-y-3">
              <h4 className="font-bold text-blue-400 uppercase text-xs mb-3">Thông tin học tập</h4>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span>Lớp:</span> <span className="text-white font-medium">{student.className}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span>Khoa:</span> <span className="text-white font-medium">{student.faculty}</span>
              </div>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5 space-y-3">
              <h4 className="font-bold text-blue-400 uppercase text-xs mb-3">Thông tin cá nhân</h4>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span>Ngày sinh:</span> <span className="text-white">{student.dateOfBirth || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span>Giới tính:</span> <span className="text-white">{student.gender || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span>SĐT:</span> <span className="text-white">{student.phone || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span>Email:</span> <span className="text-white">{student.email || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Địa chỉ:</span> <span className="text-white truncate max-w-[200px]" title={student.address}>{student.address || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;