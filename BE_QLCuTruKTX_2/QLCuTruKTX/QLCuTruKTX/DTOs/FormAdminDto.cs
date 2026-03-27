namespace QLCuTruKTX.DTOs
{
    public class FormAdminDto
    {
        public int Id { get; set; }

        public string StudentId { get; set; } = "";
        public string StudentName { get; set; } = "";

        public string LoaiDon { get; set; } = "";
        public DateTime NgayTao { get; set; }

        public string TrangThai { get; set; } = "";
    }
}
