using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.Models;

namespace QLCuTruKTX.Controllers
{
    [ApiController]
    [Route("api/attendance")]
    [Authorize] // Cho phép cả Admin và User đã đăng nhập
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public AttendanceController(ApplicationDbContext db)
        {
            _db = db;
        }

        // ================= ADMIN: LẤY DANH SÁCH ĐIỂM DANH =================
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetChecklist([FromQuery] DateTime date)
        {
            var checkDate = date.Date;

            // 1. Lấy tất cả sinh viên đang ở (Active)
            var activeTenancies = await _db.Tenancies
                .Include(t => t.Student).Include(t => t.Room)
                .Where(t => t.Status == "active")
                .ToListAsync();

            // 2. Lấy dữ liệu điểm danh cũ của ngày đó (nếu đã điểm danh rồi)
            var existingRecords = await _db.Attendances
                .Where(a => a.Date == checkDate)
                .ToListAsync();

            // 3. Lấy đơn xin vắng đã duyệt (để tự động đánh dấu "Có phép")
            // Lưu ý: Tên biến phải khớp với Model Form của bạn (TrangThai, NgayBatDau...)
            var approvedAbsences = await _db.Forms
                .Where(f => f.LoaiDon == "tam_vang"
                            && f.TrangThai == "approved"
                            && f.NgayBatDau <= checkDate
                            && f.NgayKetThuc >= checkDate)
                .ToListAsync();

            // 4. Gộp dữ liệu trả về
            var result = activeTenancies.Select(t =>
            {
                var record = existingRecords.FirstOrDefault(r => r.StudentId == t.StudentId);
                var hasAbsence = approvedAbsences.Any(f => f.SinhVienId == t.StudentId);

                string status = "Present";
                string note = "";

                if (record != null)
                {
                    status = record.Status;
                    note = record.Note;
                }
                else if (hasAbsence)
                {
                    status = "Excused";
                    note = "Có đơn xin vắng";
                }

                return new
                {
                    StudentId = t.Student.Id,
                    StudentName = t.Student.FullName,
                    RoomNumber = t.Room.RoomNumber,
                    Status = status,
                    Note = note
                };
            }).OrderBy(x => x.RoomNumber).ThenBy(x => x.StudentName);

            return Ok(result);
        }

        // ================= ADMIN: LƯU ĐIỂM DANH =================
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> SaveChecklist([FromBody] SaveAttendanceDto dto)
        {
            var checkDate = dto.Date.Date;

            // Xóa bản ghi cũ của ngày này để lưu mới (cách đơn giản nhất)
            var oldRecords = _db.Attendances.Where(a => a.Date == checkDate);
            _db.Attendances.RemoveRange(oldRecords);

            var newRecords = dto.Records.Select(r => new Attendance
            {
                Date = checkDate,
                StudentId = r.StudentId,
                Status = r.Status,
                Note = r.Note
            });

            _db.Attendances.AddRange(newRecords);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Đã lưu thành công!" });
        }

        // ================= SINH VIÊN: XEM LỊCH SỬ CỦA MÌNH =================
        [HttpGet("my-history")]
        public async Task<IActionResult> GetMyHistory()
        {
            var username = User.Identity?.Name;
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null || user.SinhVienId == null)
                return BadRequest("Tài khoản này chưa liên kết với thông tin sinh viên.");

            var history = await _db.Attendances
                .Where(a => a.StudentId == user.SinhVienId)
                .OrderByDescending(a => a.Date)
                .Select(a => new
                {
                    Date = a.Date,
                    Status = a.Status,
                    Note = a.Note
                })
                .ToListAsync();

            return Ok(history);
        }
    }

    public class SaveAttendanceDto
    {
        public DateTime Date { get; set; }
        public List<AttendanceRecordDto> Records { get; set; }
    }

    public class AttendanceRecordDto
    {
        public int StudentId { get; set; }
        public string Status { get; set; }
        public string Note { get; set; }
    }
}