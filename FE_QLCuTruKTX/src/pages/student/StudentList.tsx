import { useEffect, useState } from "react";
import { studentsApi } from "../../api/students.api";
import type { Student } from "../../types/student";

import PageTitle from "../../components/common/PageTitle";
import Button from "../../components/ui/Button";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "../../components/ui/Table";

import StudentDetailModal from "./StudentDetailModal";
import AssignRoomModal from "./AssignRoomModal";
import { hubConnection } from "../../signalr/signalRConnection";

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [assignStudent, setAssignStudent] = useState<Student | null>(null);

  useEffect(() => {
    load();

    const handler = () => load();
    hubConnection.on("RoomUpdated", handler);
    hubConnection.on("StudentUpdated", handler);

    if (hubConnection.state === "Disconnected") {
      hubConnection.start().catch(err => console.error("SignalR:", err));
    }

    return () => {
      hubConnection.off("RoomUpdated", handler);
      hubConnection.off("StudentUpdated", handler);
    };
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await studentsApi.getAll();
      setStudents(res.data as Student[]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageTitle title="Quản lý sinh viên" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MSSV</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Lớp</TableHead>
            <TableHead>Phòng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!loading &&
            students.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.studentId}</TableCell>
                <TableCell>{s.fullName}</TableCell>
                <TableCell>{s.gender}</TableCell>
                <TableCell>{s.className}</TableCell>
                <TableCell>{s.roomName ?? "Chưa có phòng"}</TableCell>

                <TableCell>
                  <span
                    className={
                      s.status === "active"
                        ? "text-green-500 font-semibold"
                        : "text-gray-400"
                    }
                  >
                    {s.status}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => setSelectedStudent(s)}
                    >
                      Chi tiết
                    </Button>

                    <Button
                      size="sm"
                      color="success"
                      onClick={() => setAssignStudent(s)}
                    >
                      Gán phòng
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

          {loading && (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="text-center py-4 text-slate-500">
                  Đang tải dữ liệu...
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {assignStudent && (
        <AssignRoomModal
          student={assignStudent}
          onClose={() => setAssignStudent(null)}
          onAssigned={load}
        />
      )}
    </div>
  );
}
