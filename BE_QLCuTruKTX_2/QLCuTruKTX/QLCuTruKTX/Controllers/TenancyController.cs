using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.DTOs;
using QLCuTruKTX.Hubs;
using QLCuTruKTX.Models;

namespace QLCuTruKTX.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TenancyController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IHubContext<RoomStatusHub> _hub;

        public TenancyController(ApplicationDbContext db, IHubContext<RoomStatusHub> hub)
        {
            _db = db;
            _hub = hub;
        }

        // ============================================================
        // GÁN PHÒNG
        // ============================================================
        [HttpPost("assign")]
        public async Task<IActionResult> AssignRoom(int studentId, int roomId)
        {
            var student = await _db.Students
                .Include(s => s.Tenancies)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null)
                return NotFound(new { message = "Không tìm thấy sinh viên." });

            var room = await _db.Rooms
                .Include(r => r.Tenancies)
                .FirstOrDefaultAsync(r => r.Id == roomId);

            if (room == null)
                return NotFound(new { message = "Không tìm thấy phòng." });

            int activeCount = room.Tenancies.Where(t => t.Status == "active").Count();
            if (activeCount >= room.Capacity)
                return BadRequest(new { message = "Phòng đã đầy." });

            var tenancy = new Tenancy
            {
                StudentId = studentId,
                RoomId = roomId,
                StartDate = DateTime.UtcNow,
                Status = "active"
            };

            _db.Tenancies.Add(tenancy);
            await _db.SaveChangesAsync();

            await UpdateRoomStatus(room);
            await _hub.Clients.All.SendAsync("RoomUpdated", roomId);

            return Ok(new
            {
                message = "Gán phòng thành công.",
                tenancy = new TenancyDto
                {
                    Id = tenancy.Id,
                    StudentId = tenancy.StudentId,
                    RoomId = tenancy.RoomId,
                    StartDate = tenancy.StartDate,
                    EndDate = tenancy.EndDate,
                    Status = tenancy.Status
                }
            });
        }

        // ============================================================
        // TRẢ PHÒNG
        // ============================================================
        [HttpPut("end/{tenancyId}")]
        public async Task<IActionResult> EndTenancy(int tenancyId)
        {
            var tenancy = await _db.Tenancies
                .Include(t => t.Room)
                .FirstOrDefaultAsync(t => t.Id == tenancyId);

            if (tenancy == null)
                return NotFound(new { message = "Không tìm thấy dữ liệu." });

            if (tenancy.Status == "ended")
                return BadRequest(new { message = "Sinh viên đã trả phòng trước đó." });

            tenancy.Status = "ended";
            tenancy.EndDate = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            await UpdateRoomStatus(tenancy.Room);
            await _hub.Clients.All.SendAsync("RoomUpdated", tenancy.RoomId);

            return Ok(new { message = "Trả phòng thành công." });
        }

        // ============================================================
        // LẤY DANH SÁCH SINH VIÊN ĐANG Ở TRONG 1 PHÒNG
        // ============================================================
        [HttpGet("room/{roomId}")]
        public async Task<IActionResult> GetActiveTenants(int roomId)
        {
            var list = await _db.Tenancies
                .Include(t => t.Student)
                .Where(t => t.RoomId == roomId && t.Status == "active")
                .ToListAsync();

            return Ok(list);
        }

        // ============================================================
        // CẬP NHẬT TRẠNG THÁI PHÒNG
        // ============================================================
        private async Task UpdateRoomStatus(Room room)
        {
            int active = await _db.Tenancies
                .Where(t => t.RoomId == room.Id && t.Status == "active")
                .CountAsync();

            room.CurrentOccupancy = active;

            if (active == 0) room.Status = "empty";
            else if (active >= room.Capacity) room.Status = "full";
            else room.Status = "partial";

            await _db.SaveChangesAsync();
        }
    }
}
