using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.Models;

namespace QLCuTruKTX.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public FormsController(ApplicationDbContext db)
        {
            _db = db;
        }

        // ================= CREATE FORM =================
        [HttpPost]
        public async Task<IActionResult> Create(Form dto)
        {
            dto.TrangThai = "pending";
            dto.NgayTao = DateTime.UtcNow;

            _db.Forms.Add(dto);
            await _db.SaveChangesAsync();

            return Ok(dto);
        }

        // ================= ADMIN: GET ALL FORMS (ĐÃ SỬA) =================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.Forms
                .Include(f => f.Student) // <--- Bắt buộc có dòng này
                .OrderByDescending(f => f.NgayTao)
                .Select(f => new
                {
                    f.Id,
                    f.LoaiDon,
                    f.LyDo,
                    f.NgayTao,
                    f.TrangThai,
                    f.SinhVienId,
                    // Quan trọng: Kiểm tra null trước khi lấy thông tin
                    Student = f.Student == null ? null : new
                    {
                        f.Student.StudentId,
                        f.Student.FullName
                    }
                })
                .ToListAsync();

            return Ok(list);
        }
        // ================= STUDENT: GET MY FORMS =================
        [HttpGet("my/{svId}")]
        public async Task<IActionResult> GetMy(int svId)
        {
            var list = await _db.Forms
                .Where(f => f.SinhVienId == svId)
                .OrderByDescending(f => f.NgayTao)
                .Select(f => new
                {
                    f.Id,
                    f.LoaiDon,
                    f.LyDo,
                    f.NgayTao,
                    f.TrangThai,
                    Student = f.Student == null ? null : new
                    {
                        f.Student.StudentId,
                        f.Student.FullName
                    }
                })
                .ToListAsync();

            return Ok(list);
        }

        // ================= ADMIN: UPDATE STATUS =================
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] FormStatusUpdateVM dto)
        {
            var form = await _db.Forms.FindAsync(id);
            if (form == null) return NotFound();

            form.TrangThai = dto.TrangThai;
            await _db.SaveChangesAsync();

            return Ok(form);
        }
    }

    // Class DTO để cập nhật trạng thái
    public class FormStatusUpdateVM
    {
        public string TrangThai { get; set; } = "";
    }
}