using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.Models;
using QLCuTruKTX.DTOs;
using QLCuTruKTX.Mappings;


namespace QLCuTruKTX.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoommateRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public RoommateRequestController(ApplicationDbContext db)
        {
            _db = db;
        }

        // ======================
        // CREATE REQUEST
        // ======================
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] RoommateRequestCreateDto dto)
        {
            var sv = await _db.Students.FindAsync(dto.SinhVienId);
            if (sv == null)
                return NotFound(new { message = "Sinh viên không tồn tại" });

            // Không cho gửi yêu cầu trùng
            var exists = await _db.RoommateRequests
                .AnyAsync(r => r.SinhVienId == dto.SinhVienId && r.TrangThai == "pending");

            if (exists)
                return BadRequest(new { message = "Bạn đã gửi một yêu cầu và đang chờ duyệt." });

            var req = new RoommateRequest
            {
                SinhVienId = dto.SinhVienId,
                Student = sv,       // 🔥 FIX CS9035
                NoiDung = dto.NoiDung,
                NgayTao = DateTime.UtcNow,
                TrangThai = "pending"
            };

            _db.RoommateRequests.Add(req);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Gửi yêu cầu thành công", data = req.ToDto() });
        }

        // ======================
        // GET ALL REQUESTS
        // ======================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.RoommateRequests
                .Include(r => r.Student)
                .OrderByDescending(r => r.NgayTao)
                .ToListAsync();

            return Ok(list.Select(r => r.ToDto()));
        }

        // ======================
        // GET REQUESTS BY STUDENT
        // ======================
        [HttpGet("student/{id}")]
        public async Task<IActionResult> GetByStudent(int id)
        {
            var list = await _db.RoommateRequests
                .Where(r => r.SinhVienId == id)
                .Include(r => r.Student)
                .OrderByDescending(r => r.NgayTao)
                .ToListAsync();

            return Ok(list.Select(r => r.ToDto()));
        }

        // ======================
        // APPROVE
        // ======================
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var req = await _db.RoommateRequests.FindAsync(id);
            if (req == null)
                return NotFound(new { message = "Không tìm thấy yêu cầu" });

            if (req.TrangThai != "pending")
                return BadRequest(new { message = "Yêu cầu đã được xử lý trước đó" });

            req.TrangThai = "approved";
            await _db.SaveChangesAsync();

            return Ok(new { message = "Duyệt yêu cầu thành công" });
        }

        // ======================
        // REJECT
        // ======================
        [HttpPut("reject/{id}")]
        public async Task<IActionResult> Reject(int id)
        {
            var req = await _db.RoommateRequests.FindAsync(id);
            if (req == null)
                return NotFound(new { message = "Không tìm thấy yêu cầu" });

            if (req.TrangThai != "pending")
                return BadRequest(new { message = "Yêu cầu đã được xử lý trước đó" });

            req.TrangThai = "rejected";
            await _db.SaveChangesAsync();

            return Ok(new { message = "Từ chối yêu cầu thành công" });
        }

        // ======================
        // DELETE
        // ======================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var req = await _db.RoommateRequests.FindAsync(id);
            if (req == null)
                return NotFound(new { message = "Không tìm thấy yêu cầu" });

            _db.RoommateRequests.Remove(req);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Xóa yêu cầu thành công" });
        }
    }
}
