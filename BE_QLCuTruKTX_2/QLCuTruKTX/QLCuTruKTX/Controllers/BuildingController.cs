using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.Models;

namespace QLCuTruKTX.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BuildingController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public BuildingController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/Building
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var buildings = await _db.Buildings.ToListAsync();
            return Ok(buildings);
        }

        // GET: api/Building/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var b = await _db.Buildings.FindAsync(id);
            if (b == null) return NotFound();
            return Ok(b);
        }

        // POST: api/Building
        [HttpPost]
        public async Task<IActionResult> Create(Building building)
        {
            _db.Buildings.Add(building);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Tạo tòa nhà thành công!", building });
        }

        // PUT: api/Building/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Building dto)
        {
            var b = await _db.Buildings.FindAsync(id);
            if (b == null) return NotFound();

            b.Code = dto.Code;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công!", b });
        }

        // DELETE: api/Building/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var b = await _db.Buildings.FindAsync(id);
            if (b == null) return NotFound();

            _db.Buildings.Remove(b);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Xóa thành công!" });
        }
    }
}
