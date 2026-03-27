using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;

namespace QLCuTruKTX.Controllers
{
    [ApiController]
    [Route("api/chat")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ChatController(ApplicationDbContext db) { _db = db; }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            try
            {
                var msgs = await _db.ChatMessages
                    .Include(m => m.Sender) // Load thông tin người gửi
                    .OrderByDescending(m => m.Timestamp)
                    .Take(50)
                    .OrderBy(m => m.Timestamp)
                    .Select(m => new
                    {
                        SenderId = m.SenderId,
                        SenderName = m.Sender != null ? m.Sender.Username : "Unknown", // Fix lỗi null
                        Message = m.Message,
                        Timestamp = m.Timestamp,
                        IsMine = m.Sender != null && m.Sender.Username == User.Identity.Name
                    })
                    .ToListAsync();

                return Ok(msgs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi server: " + ex.Message);
            }
        }
    }
}