using System;
using QLCuTruKTX.Models;

namespace QLCuTruKTX.Models
{
    public class Tenancy
    {
        public int Id { get; set; }

        // ===== Foreign Keys =====
        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public int RoomId { get; set; }
        public Room Room { get; set; } = null!;

        // ===== Trạng thái thuê =====
        public string Status { get; set; } = "active";

        // ===== Ngày bắt đầu – kết thúc =====
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
