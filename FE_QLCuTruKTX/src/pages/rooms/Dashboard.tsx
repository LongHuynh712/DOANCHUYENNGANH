import { useEffect, useState } from "react";
import { roomApi } from "../../api/roomApi";
import type { Room } from "../../types/room";
import { hubConnection } from "../../signalr/signalRConnection";
import "./../../styles/rooms.css";

export default function Dashboard() {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        load();

        const updateHandler = () => load();

        hubConnection.on("RoomUpdated", updateHandler);

        if (hubConnection.state === "Disconnected") {
            hubConnection.start().catch(err => console.error("SignalR:", err));
        }

        return () => hubConnection.off("RoomUpdated", updateHandler);
    }, []);

    const load = async () => {
        try {
            const res = await roomApi.getAll();
            setRooms(res.data);
        } catch (err) {
            console.error("Load dashboard error:", err);
        }
    };

    const total = rooms.length;
    const empty = rooms.filter(r => r.status === "empty").length;
    const full = rooms.filter(r => r.status === "full").length;

    const usedCapacity = rooms.reduce((sum, r) => sum + r.currentOccupancy, 0);
    const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);

    const percentUse =
        totalCapacity > 0 ? ((usedCapacity / totalCapacity) * 100).toFixed(1) : 0;

    return (
        <div className="dash-container">
            <h2 className="room-title">Tổng quan hệ thống</h2>

            <div className="dash-grid">
                <div className="dash-card dash1">
                    <h3>{total}</h3>
                    <p>Tổng số phòng</p>
                </div>

                <div className="dash-card dash2">
                    <h3>{empty}</h3>
                    <p>Phòng trống</p>
                </div>

                <div className="dash-card dash3">
                    <h3>{full}</h3>
                    <p>Phòng đầy</p>
                </div>

                <div className="dash-card dash4">
                    <h3>{percentUse}%</h3>
                    <p>Tỷ lệ sử dụng</p>
                </div>
            </div>
        </div>
    );
}
