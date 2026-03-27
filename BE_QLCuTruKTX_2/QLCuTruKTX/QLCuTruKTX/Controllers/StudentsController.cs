using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.DTOs;
using QLCuTruKTX.Models; // Đảm bảo import Model

namespace QLCuTruKTX.Controllers
{
    [ApiController]
    [Route("api/students")]
    [Authorize]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public StudentsController(ApplicationDbContext db)
        {
            _db = db;
        }

        // ============================ 1. THÊM SINH VIÊN (MỚI) =========================
        [HttpPost]
        [Authorize(Roles = "admin")] // Chỉ admin mới được thêm
        public async Task<IActionResult> Create([FromBody] CreateStudentDto dto)
        {
            // 1. Kiểm tra trùng MSSV
            if (await _db.Students.AnyAsync(s => s.StudentId == dto.StudentId))
            {
                return BadRequest("Mã số sinh viên này đã tồn tại!");
            }

            // 2. Tạo thông tin Sinh viên
            var student = new Student
            {
                StudentId = dto.StudentId,
                FullName = dto.FullName,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                Phone = dto.Phone,
                Email = dto.Email,
                ClassName = dto.ClassName,
                Faculty = dto.Faculty,
                IdCard = dto.IdCard,
                Address = dto.Address,
                Status = "active"
            };

            _db.Students.Add(student);
            await _db.SaveChangesAsync(); // Lưu để lấy ID tự tăng

            // 3. Tự động tạo tài khoản đăng nhập (User)
            // Username = MSSV, Pass = 123456
            var user = new User
            {
                Username = dto.StudentId,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                Role = "user",
                SinhVienId = student.Id
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Thêm thành công!", student });
        }

        // ============================ 2. GET MY PROFILE =========================
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null || user.SinhVienId == null)
                return BadRequest("Tài khoản này chưa liên kết hồ sơ sinh viên.");

            var student = await _db.Students
                .Include(s => s.Tenancies)
                .FirstOrDefaultAsync(s => s.Id == user.SinhVienId);

            return Ok(student);
        }

        // ============================ 3. UPDATE MY PROFILE =========================
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] StudentUpdateSelfDto dto)
        {
            var username = User.Identity?.Name;
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null || user.SinhVienId == null) return BadRequest();

            var student = await _db.Students.FindAsync(user.SinhVienId);
            if (student == null) return NotFound();

            student.Email = dto.Email;
            student.Phone = dto.PhoneNumber;
            student.Address = dto.Address;

            await _db.SaveChangesAsync();
            return Ok(student);
        }

        // ============================ CÁC API CHO ADMIN =========================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _db.Students.Include(s => s.Tenancies).ThenInclude(t => t.Room).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var s = await _db.Students.Include(s => s.Tenancies).ThenInclude(t => t.Room).FirstOrDefaultAsync(x => x.Id == id);
            return s == null ? NotFound() : Ok(s);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateByAdmin(int id, [FromBody] StudentUpdateAdminDto dto)
        {
            var s = await _db.Students.FindAsync(id);
            if (s == null) return NotFound();
            s.FullName = dto.FullName;
            s.ClassName = dto.ClassName;
            s.Faculty = dto.Faculty;
            s.Status = dto.Status;
            await _db.SaveChangesAsync();
            return Ok(s);
        }
    }

    // DTO cho việc tạo mới (Đặt ở đây hoặc trong thư mục DTOs)
    public class CreateStudentDto
    {
        public string StudentId { get; set; }
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string ClassName { get; set; }
        public string Faculty { get; set; }
        public string IdCard { get; set; }
        public string Address { get; set; }
    }
}