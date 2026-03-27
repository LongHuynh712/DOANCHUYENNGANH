using System;

namespace QLCuTruKTX.Models
{
    public class MaintenanceRequest
    {
        public int Id { get; set; }

        // Phòng liên quan
        public int RoomId { get; set; }
        public Room Room { get; set; } = null!;

        // Sinh viên gửi yêu cầu
        public int? SinhVienId { get; set; }
        public Student? Student { get; set; }

        public string Title { get; set; } = "";
        public string Description { get; set; } = "";

        public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
