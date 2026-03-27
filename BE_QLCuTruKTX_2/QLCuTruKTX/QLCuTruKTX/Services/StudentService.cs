using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.Models;

namespace QLCuTruKTX.Services
{
    public class StudentService : IStudentService
    {
        private readonly ApplicationDbContext _db;

        public StudentService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<Student?> GetByIdAsync(int id)
        {
            return await _db.Students.FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<Student>> GetAllAsync()
        {
            return await _db.Students.ToListAsync();
        }
    }
}
