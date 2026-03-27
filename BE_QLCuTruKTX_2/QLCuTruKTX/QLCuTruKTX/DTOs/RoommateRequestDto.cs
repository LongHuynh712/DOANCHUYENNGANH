namespace QLCuTruKTX.DTOs
{
    public class RoommateRequestDto
    {
        public int Id { get; set; }
        public int SinhVienId { get; set; }

        public string HoTen { get; set; } = "";
        public string? MSSV { get; set; }

        // 🔥 SỬA TÊN: LyDo → NoiDung (đồng bộ với Model + Mapping)
        public string NoiDung { get; set; } = "";

        public string TrangThai { get; set; } = "";
        public DateTime NgayTao { get; set; }
    }
}
