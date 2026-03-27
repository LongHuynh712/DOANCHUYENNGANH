using System;

namespace QLCuTruKTX.DTOs
{
    public class ResidenceFormDto
    {
        public int Id { get; set; }
        public string Reason { get; set; } = "";
        public string Status { get; set; } = "pending";
        public DateTime CreatedAt { get; set; }

        // Gửi kèm để FE hiển thị
        public string StudentName { get; set; } = "";
        public string StudentCode { get; set; } = "";
    }
}
