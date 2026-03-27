namespace QLCuTruKTX.Models
{
    public class Form
    {
        public int Id { get; set; }

        public int SinhVienId { get; set; }
        public Student? Student { get; set; }

        public string LoaiDon { get; set; } = ""; // tam_tru | tam_vang
        public string DiaDiem { get; set; } = "";

        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }

        public string LyDo { get; set; } = "";

        public string TrangThai { get; set; } = "pending";

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;
    }
}
