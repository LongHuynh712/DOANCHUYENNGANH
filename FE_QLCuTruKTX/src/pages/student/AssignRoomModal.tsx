import { useEffect, useState } from "react";
import { Student } from "../../types/student";
import Button from "../../components/ui/Button";
import { roomApi } from "../../api/roomApi";
import { studentsApi } from "../../api/students.api";

interface Props {
  student: Student;
  onClose: () => void;
  onAssigned: () => Promise<void>;
}

export default function AssignRoomModal({ student, onClose, onAssigned }: Props) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const res = await roomApi.getAll();
    setRooms(res.data);
  };

  const assignRoom = async () => {
    if (!selectedRoom) return;

    setLoading(true);

    await studentsApi.assignRoom(student.id, selectedRoom);
    await onAssigned();

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[420px]">
        <h2 className="text-xl font-semibold mb-4">Gán phòng cho sinh viên</h2>

        <p className="mb-2">
          <strong>{student.fullName}</strong> – {student.studentId}
        </p>

        <select
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={selectedRoom ?? ""}
          onChange={(e) => setSelectedRoom(Number(e.target.value))}
        >
          <option value="">-- Chọn phòng --</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.roomNumber ?? r.name} (còn {r.capacity - r.currentOccupancy})
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>

          <Button
            disabled={!selectedRoom || loading}
            onClick={assignRoom}
            variant="primary"
          >
            {loading ? "Đang lưu..." : "Xác nhận"}
          </Button>
        </div>
      </div>
    </div>
  );
}
