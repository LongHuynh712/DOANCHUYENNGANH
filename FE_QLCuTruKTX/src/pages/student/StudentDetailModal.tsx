import { Student } from "../../types/student";
import Button from "../../components/ui/Button";

interface Props {
  student: Student;
  onClose: () => void;
}

export default function StudentDetailModal({ student, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[420px] animate-fadeIn">
        <h2 className="text-xl font-semibold mb-3 text-slate-800">
          Thông tin sinh viên
        </h2>

        <div className="space-y-2 text-slate-700 text-sm">
          <p><strong>MSSV:</strong> {student.studentId}</p>
          <p><strong>Họ tên:</strong> {student.fullName}</p>
          <p><strong>Giới tính:</strong> {student.gender}</p>

          {/* BE trả DateTime → FE nhận string → convert OK */}
          <p><strong>Ngày sinh:</strong> 
            {new Date(student.dateOfBirth).toLocaleDateString()}
          </p>

          <p><strong>Lớp:</strong> {student.className}</p>
          <p><strong>Khoa:</strong> {student.faculty}</p>
          <p><strong>Số điện thoại:</strong> {student.phone}</p>
          <p><strong>Email:</strong> {student.email}</p>

          {/* các field này ĐÚNG 100% với backend Student.cs */}
          <p><strong>CMND/CCCD:</strong> {student.idCard}</p>
          <p><strong>Địa chỉ:</strong> {student.address}</p>

          <p>
            <strong>Trạng thái:</strong>{" "}
            <span
              className={
                student.status === "active"
                  ? "text-green-600 font-semibold"
                  : "text-gray-500"
              }
            >
              {student.status}
            </span>
          </p>

          <p>
            <strong>Phòng hiện tại:</strong>{" "}
            {student.roomName ?? "Chưa có phòng"}
          </p>
        </div>

        <div className="flex justify-end mt-5">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
