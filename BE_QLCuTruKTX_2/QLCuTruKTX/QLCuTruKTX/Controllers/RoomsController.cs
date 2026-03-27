using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.Models;

namespace QLCuTruKTX.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public RoomsController(ApplicationDbContext db)
        {
            _db = db;
        }

        // ====================== GET ALL ROOMS ======================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rooms = await _db.Rooms
                .Include(r => r.Tenancies)
                .Select(r => new
                {
                    r.Id,
                    r.RoomNumber,
                    r.Capacity,
                    r.CurrentOccupancy,
                    r.Status,
                    r.BuildingId
                })
                .ToListAsync();

            return Ok(rooms);
        }

        // ====================== GET ROOM BY ID ======================
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var room = await _db.Rooms
                .Include(r => r.Tenancies!)
                    .ThenInclude(t => t.Student)
                .Where(r => r.Id == id)
                .Select(r => new
                {
                    r.Id,
                    r.RoomNumber,
                    r.Capacity,
                    r.CurrentOccupancy,
                    r.Status,
                    r.BuildingId,
                    Tenancies = r.Tenancies.Select(t => new
                    {
                        t.Id,
                        StudentId = t.StudentId,
                        t.StartDate,
                        t.EndDate,
                        t.Status,
                        Student = new
                        {
                            t.Student.Id,
                            t.Student.FullName,
                            t.Student.StudentId,
                            t.Student.ClassName
                        }
                    })
                })
                .FirstOrDefaultAsync();

            if (room == null)
                return NotFound(new { message = "Không tìm thấy phòng." });

            return Ok(room);
        }

        // ====================== CREATE ROOM ======================
        [HttpPost]
        public async Task<IActionResult> Create(Room room)
        {
            if (room == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });

            // Kiểm tra Building tồn tại
            var building = await _db.Buildings.FindAsync(room.BuildingId);
            if (building == null)
                return NotFound(new { message = "Không tìm thấy tòa nhà!" });

            // Kiểm tra trùng phòng
            var exists = await _db.Rooms
                .AnyAsync(r => r.BuildingId == room.BuildingId && r.RoomNumber == room.RoomNumber);

            if (exists)
                return Conflict(new { message = "Phòng này đã tồn tại trong tòa nhà!" });

            // Gán mặc định
            room.CurrentOccupancy = 0;
            room.Status = "empty";

            _db.Rooms.Add(room);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                room.Id,
                room.RoomNumber,
                room.Capacity,
                room.CurrentOccupancy,
                room.Status,
                room.BuildingId
            });
        }

        // ====================== UPDATE ROOM ======================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Room updated)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null)
                return NotFound(new { message = "Không tìm thấy phòng." });

            var building = await _db.Buildings.FindAsync(updated.BuildingId);
            if (building == null)
                return NotFound(new { message = "Không tìm thấy tòa nhà!" });

            room.RoomNumber = updated.RoomNumber;
            room.Capacity = updated.Capacity;
            room.BuildingId = updated.BuildingId;
            room.Status = updated.Status;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                room.Id,
                room.RoomNumber,
                room.Capacity,
                room.CurrentOccupancy,
                room.Status,
                room.BuildingId
            });
        }

        // ====================== DELETE ROOM ======================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null)
                return NotFound(new { message = "Không tìm thấy phòng." });

            if (room.CurrentOccupancy > 0)
                return BadRequest(new { message = "Không thể xóa phòng đang có sinh viên cư trú!" });

            _db.Rooms.Remove(room);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Xóa phòng thành công." });
        }
    }
}
