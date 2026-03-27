using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.Models;

namespace QLCuTruKTX.Controllers
{
    [ApiController]
    [Route("api/news")]
    public class NewsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public NewsController(ApplicationDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _db.News.OrderByDescending(n => n.CreatedAt).ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] News news)
        {
            news.CreatedAt = DateTime.Now;
            _db.News.Add(news);
            await _db.SaveChangesAsync();
            return Ok(news);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.News.FindAsync(id);
            if (item == null) return NotFound();
            _db.News.Remove(item);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}