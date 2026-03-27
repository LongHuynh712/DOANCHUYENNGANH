export default function RoomCard({ data, onClick }) {
    const {
        name,
        capacity,
        currentOccupancy,
        status,
    } = data;

    return (
        <div className="room-card" onClick={onClick}>
            <h3 className="room-name">{name}</h3>
            <p>{currentOccupancy}/{capacity} sinh viên</p>

            <p>
                <strong>Trạng thái:</strong> {status.toUpperCase()}
            </p>
        </div>
    );
}
