using System.ComponentModel.DataAnnotations;

namespace QLCuTruKTX.DTOs
{
    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = "";
        [Required]
        public string Password { get; set; } = "";
    }

    public class AuthUserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = "";
        public string Role { get; set; } = "";
        public int? SinhVienId { get; set; }   // ⭐ FE dùng trường này
    }

    public class AuthResponse
    {
        public string Token { get; set; } = "";
        public AuthUserDto User { get; set; } = new AuthUserDto();
    }
}
