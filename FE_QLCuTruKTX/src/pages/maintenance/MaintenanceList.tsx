import { useEffect, useState } from "react";
import { maintenanceApi } from "../../api/maintenanceApi";
import type { MaintenanceRequest } from "../../types/maintenance";
import { getHubConnection, startHub, stopHub } from "../../signalr/signalRConnection";

export default function MaintenanceList() {
    const [list, setList] = useState<MaintenanceRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
        connectRealtime();

        return () => {
            stopHub();
        };
    }, []);

    const load = async () => {
        const res = await maintenanceApi.getAll();
        setList(res.data);
        setLoading(false);
    };

    const connectRealtime = async () => {
        const hub = getHubConnection();
        await startHub();

        // ✔ Có yêu cầu bảo trì mới
        hub.on("MaintenanceCreated", (data: MaintenanceRequest) => {
            setList(prev => [data, ...prev]);
        });

        // ✔ Cập nhật trạng thái
        hub.on("MaintenanceUpdated", (data: MaintenanceRequest) => {
            setList(prev =>
                prev.map(m => (m.id === data.id ? data : m))
            );
        });

        // ✔ Xóa yêu cầu
        hub.on("MaintenanceDeleted", (id: number) => {
            setList(prev => prev.filter(m => m.id !== id));
        });
    };

    const updateStatus = async (id: number, status: string) => {
        await maintenanceApi.updateStatus(id, status);
        // ❌ KHÔNG load lại — realtime tự cập nhật
    };

    const remove = async (id: number) => {
        if (!confirm("Xác nhận xóa?")) return;
        await maintenanceApi.delete(id);
        // ❌ KHÔNG load lại
    };

    return (
        <div className="page-container">
            <h2 className="room-title">Quản lý bảo trì (Realtime)</h2>

            {loading && <p>Đang tải...</p>}

            <table className="maint-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Phòng</th>
                        <th>Tiêu đề</th>
                        <th>Mô tả</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {list.map(m => (
                        <tr key={m.id}>
                            <td>{m.id}</td>
                            <td>{m.room?.roomNumber}</td>
                            <td>{m.title}</td>
                            <td>{m.description}</td>
                            <td>{m.status}</td>
                            <td>
                                <button onClick={() => updateStatus(m.id, "in_progress")}>
                                    Đang xử lý
                                </button>
                                <button onClick={() => updateStatus(m.id, "completed")}>
                                    Hoàn thành
                                </button>
                                <button onClick={() => remove(m.id)}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
