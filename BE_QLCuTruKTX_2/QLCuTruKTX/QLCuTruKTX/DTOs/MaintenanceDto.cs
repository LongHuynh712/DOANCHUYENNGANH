public class MaintenanceDto
{
    public int Id { get; set; }
    public int SinhVienId { get; set; }

    public string HoTen { get; set; } = "";
    public string MSSV { get; set; } = "";
    public string NoiDung { get; set; } = "";
    public string Status { get; set; } = "";

    public DateTime NgayTao { get; set; }
}
