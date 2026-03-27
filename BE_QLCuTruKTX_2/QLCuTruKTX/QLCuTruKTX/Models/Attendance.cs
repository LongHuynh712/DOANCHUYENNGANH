using QLCuTruKTX.Models;

public class Attendance
{
    public int Id { get; set; }
    public DateTime Date { get; set; } // Ngày điểm danh (chỉ lưu ngày, bỏ giờ)
    public int StudentId { get; set; }
    public Student Student { get; set; }

    // Status: "Present" (Có mặt), "Excused" (Vắng có phép), "Unexcused" (Vắng không phép)
    public string Status { get; set; }
    public string Note { get; set; } // Ghi chú (VD: Về quê gấp...)
}