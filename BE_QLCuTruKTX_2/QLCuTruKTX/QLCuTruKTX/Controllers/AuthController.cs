using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.DTOs;
using QLCuTruKTX.Models;
using QLCuTruKTX.Services;

namespace QLCuTruKTX.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // ======================= LOGIN =======================
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(x => x.Username == dto.Username);

            if (user == null)
                return Unauthorized("Sai tài khoản hoặc mật khẩu!");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Sai tài khoản hoặc mật khẩu!");

            // ================= AUTO-GÁN PHÒNG =====================
            if (user.SinhVienId != null)
            {
                bool hasRoom = await _db.Tenancies
                    .AnyAsync(t => t.StudentId == user.SinhVienId && t.Status == "active");

                if (!hasRoom)
                {
                    var room = await _db.Rooms
                        .Where(r => r.CurrentOccupancy < r.Capacity)
                        .OrderBy(r => r.CurrentOccupancy)
                        .FirstOrDefaultAsync();

                    if (room != null)
                    {
                        var tenancy = new Tenancy
                        {
                            StudentId = user.SinhVienId.Value,
                            RoomId = room.Id,
                            Status = "active",
                            StartDate = DateTime.Now
                        };

                        _db.Tenancies.Add(tenancy);
                        room.CurrentOccupancy++;
                        await _db.SaveChangesAsync();
                    }
                }
            }

            // ================= TẠO TOKEN =========================
            string token = JwtService.GenerateToken(
                user.Id,
                user.Username,
                user.Role,
                _config
            );

            return Ok(new AuthResponse
            {
                Token = token,
                User = new AuthUserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Role = user.Role,
                    SinhVienId = user.SinhVienId
                }
            });
        }
    }
}
