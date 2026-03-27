namespace QLCuTruKTX.DTOs
{
    // DTO 1: Dùng cho Sinh viên tự cập nhật thông tin cá nhân
    public class StudentUpdateSelfDto
    {
        public string Email { get; set; } = "";
        public string PhoneNumber { get; set; } = "";
        public string Address { get; set; } = "";
    }

    // DTO 2: Dùng cho Admin cập nhật thông tin sinh viên
    public class StudentUpdateAdminDto
    {
        public string FullName { get; set; } = "";
        public string ClassName { get; set; } = "";
        public string Faculty { get; set; } = "";
        public string Status { get; set; } = "";
    }
}