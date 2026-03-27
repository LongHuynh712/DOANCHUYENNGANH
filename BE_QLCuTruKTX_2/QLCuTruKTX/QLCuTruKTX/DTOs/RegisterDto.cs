namespace QLCuTruKTX.DTOs
{
    public class RegisterDto
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public string Role { get; set; } = "user";   // mặc định user
        public int? SinhVienId { get; set; }
    }
}
