using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.Models;
using System;

namespace QLCuTruKTX.Controllers
{
    [ApiController]
    [Route("api/maintenance")]
    [Authorize]
    public class MaintenanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MaintenanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ====================== 1. GỬI YÊU CẦU BÁO HỎNG ======================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMaintenanceDto dto)
        {
            try
            {
                var username = User.Identity?.Name;
                if (string.IsNullOrEmpty(username)) return Unauthorized();

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
                if (user == null || user.SinhVienId == null)
                    return BadRequest("Tài khoản chưa liên kết hồ sơ sinh viên.");

                var tenancy = await _context.Tenancies
                    .FirstOrDefaultAsync(t => t.StudentId == user.SinhVienId && t.Status == "active");

                if (tenancy == null)
                    return BadRequest("Bạn chưa có phòng nên không thể báo hỏng.");

                var request = new MaintenanceRequest
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    SinhVienId = user.SinhVienId.Value,
                    RoomId = tenancy.RoomId,
                    Status = MaintenanceStatus.Pending,
                    CreatedAt = DateTime.Now
                };

                _context.MaintenanceRequests.Add(request);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Gửi thành công!", data = request });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // ====================== 2. XEM DANH SÁCH ======================
        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            var username = User.Identity?.Name;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return Unauthorized();

            IQueryable<MaintenanceRequest> query = _context.MaintenanceRequests
                .Include(m => m.Room)
                .Include(m => m.Student)
                .OrderByDescending(m => m.CreatedAt);

            if (user.Role == "admin")
            {
                return Ok(await query.ToListAsync());
            }

            if (user.SinhVienId != null)
            {
                return Ok(await query.Where(m => m.SinhVienId == user.SinhVienId).ToListAsync());
            }

            return BadRequest("Không xác định được quyền hạn.");
        }

        // ====================== 3. CẬP NHẬT TRẠNG THÁI (FIX LỖI 400) ======================
        [HttpPut("{id}/status")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            // 🔥 DEBUG: In ra màn hình console xem Frontend gửi chữ gì
            Console.WriteLine($"[DEBUG] Cập nhật ID {id} với Status: '{dto.Status}'");

            var request = await _context.MaintenanceRequests.FindAsync(id);
            if (request == null) return NotFound("Không tìm thấy phiếu.");

            string statusStr = dto.Status.Trim();

            // 🔥 FIX: Map tiếng Việt sang Enum tiếng Anh (nếu cần)
            if (statusStr.Equals("Chờ xử lý", StringComparison.OrdinalIgnoreCase)) statusStr = "Pending";
            if (statusStr.Equals("Đang xử lý", StringComparison.OrdinalIgnoreCase)) statusStr = "InProgress"; // Hoặc Approved tùy Enum bạn
            if (statusStr.Equals("Đã xong", StringComparison.OrdinalIgnoreCase) || statusStr.Equals("Hoàn thành", StringComparison.OrdinalIgnoreCase)) statusStr = "Completed";
            if (statusStr.Equals("Hủy bỏ", StringComparison.OrdinalIgnoreCase)) statusStr = "Rejected";

            // Thử Parse sang Enum
            if (Enum.TryParse<MaintenanceStatus>(statusStr, true, out var newStatus))
            {
                request.Status = newStatus;
                await _context.SaveChangesAsync();
                Console.WriteLine($"[SUCCESS] Đã đổi trạng thái thành: {newStatus}");
                return Ok(new { message = "Cập nhật thành công!", data = request });
            }

            // Nếu vẫn lỗi, báo về danh sách hợp lệ
            Console.WriteLine($"[ERROR] Không hiểu trạng thái '{statusStr}'");
            return BadRequest($"Trạng thái '{dto.Status}' không hợp lệ. (Backend cần: Pending, InProgress, Completed, Rejected)");
        }
    }

    // DTO Classes
    public class CreateMaintenanceDto
    {
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = "";
    }
}