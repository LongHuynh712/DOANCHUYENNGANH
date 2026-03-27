public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Role { get; set; } = ""; // user | admin
    public int? SinhVienId { get; set; }   // CHỈ user có SinhVienId
}
