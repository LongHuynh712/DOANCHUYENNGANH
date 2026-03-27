import React, { useEffect, useState } from "react";
import { roomApi } from "../../api/roomApi";
import { studentsApi } from "../../api/students.api";
import Button from "../../components/ui/Button";
import { hubConnection } from "../../signalr/signalRConnection";
import "./../../styles/rooms.css";

export default function RoomDetailModal({ roomId, onClose }) {
    const [room, setRoom] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDetail();

        const handler = () => loadDetail();
        hubConnection.on("RoomUpdated", handler);

        if (hubConnection.state === "Disconnected") {
            hubConnection.start().catch(err => console.log(err));
        }

        return () => hubConnection.off("RoomUpdated", handler);
    }, [roomId]);

    const loadDetail = async () => {
        setLoading(true);

        try {
            const res = await roomApi.getById(roomId);
            const data = res.data;

            const active = data.tenancies?.filter(t => t.status === "active") ?? [];

            setRoom({
                ...data,
                name: `${data.building} - ${data.roomNumber}`,
            });

            setTenants(active);
        } catch (err) {
            console.error("Load detail error:", err);
        }

        setLoading(false);
    };

    const endTenancy = async (tenancyId) => {
        if (!confirm("Xác nhận trả phòng?")) return;

        await studentsApi.endTenancy(tenancyId);
        await loadDetail();
    };

    const moveRoom = async (studentId) => {
        const newRoomId = Number(prompt("Nhập ID phòng mới: "));
        if (!newRoomId) return;

        await studentsApi.assignRoom(studentId, newRoomId);
        await loadDetail();
    };

    if (!room) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-card">
                <h2 className="modal-title">{room.name}</h2>

                <p><strong>Sức chứa:</strong> {tenants.length}/{room.capacity}</p>

                <h3 className="sub-title">Danh sách sinh viên</h3>

                {loading && <p>Đang tải...</p>}
                {!loading && tenants.length === 0 && <p>Không có sinh viên</p>}

                <ul className="student-list">
                    {tenants.map(t => (
                        <li key={t.id} className="tenant-row">
                            <div>{t.student.fullName} ({t.student.studentId})</div>

                            <div className="action-buttons">
                                <Button size="sm" onClick={() => moveRoom(t.student.id)}>
                                    Chuyển phòng
                                </Button>

                                <Button variant="ghost" size="sm" onClick={() => endTenancy(t.id)}>
                                    Trả phòng
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>

                <button className="btn-close" onClick={onClose}>Đóng</button>
            </div>
        </div>
    );
}
