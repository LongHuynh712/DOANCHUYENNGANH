namespace QLCuTruKTX.DTOs;

public class FormCreateDto
{
    public int SinhVienId { get; set; }
    public string LoaiDon { get; set; } = "";
    public string DiaDiem { get; set; } = "";
    public DateTime NgayBatDau { get; set; }
    public DateTime NgayKetThuc { get; set; }
    public string LyDo { get; set; } = "";
}

public class FormStatusDto
{
    public string TrangThai { get; set; } = "";
}
