import React, { useEffect, useState } from "react";
import { roomApi } from "../../api/roomApi";
import RoomCard from "./RoomCard";
import RoomDetailModal from "./RoomDetailModal";
import { hubConnection } from "../../signalr/signalRConnection";
import "./../../styles/rooms.css";

export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        loadRooms();

        const handler = () => loadRooms();
        hubConnection.on("RoomUpdated", handler);

        if (hubConnection.state === "Disconnected") {
            hubConnection.start().catch(err => console.error("SignalR:", err));
        }

        return () => hubConnection.off("RoomUpdated", handler);
    }, []);

    const loadRooms = async () => {
        try {
            const res = await roomApi.getAll();
            setRooms(res.data);
        } catch (err) {
            console.error("Load rooms error:", err);
        }
    };

    return (
        <div className="room-container">
            <h2 className="room-title">Danh sách phòng</h2>

            <div className="room-grid">
                {rooms.map(room => (
                    <RoomCard
                        key={room.id}
                        data={{
                            ...room,
                            name: `${room.building} - ${room.roomNumber}`,
                            currentStudents: room.currentOccupancy,
                        }}
                        onClick={() => setSelectedRoom(room.id)}
                    />
                ))}
            </div>

            {selectedRoom && (
                <RoomDetailModal
                    roomId={selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                />
            )}
        </div>
    );
}
