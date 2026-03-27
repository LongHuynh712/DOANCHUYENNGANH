using QLCuTruKTX.Models;

public class RoommateRequest
{
    public int Id { get; set; }

    public int SinhVienId { get; set; }

    public required Student Student { get; set; }

    public string NoiDung { get; set; } = "";

    public DateTime NgayTao { get; set; } = DateTime.UtcNow;

    public string TrangThai { get; set; } = "pending";
}
