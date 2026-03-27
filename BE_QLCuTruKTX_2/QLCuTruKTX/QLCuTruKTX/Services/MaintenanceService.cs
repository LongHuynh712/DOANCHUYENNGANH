using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.Models;

namespace QLCuTruKTX.Services
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly ApplicationDbContext _db;

        public MaintenanceService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<List<MaintenanceRequest>> GetAllAsync()
        {
            return await _db.MaintenanceRequests
                .Include(m => m.Room)
                .Include(m => m.Student)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<MaintenanceRequest>> GetByRoomAsync(int roomId)
        {
            return await _db.MaintenanceRequests
                .Where(m => m.RoomId == roomId)
                .Include(m => m.Room)
                .Include(m => m.Student)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<MaintenanceRequest> CreateAsync(MaintenanceRequest req)
        {
            req.CreatedAt = DateTime.Now;
            _db.MaintenanceRequests.Add(req);
            await _db.SaveChangesAsync();
            return req;
        }

        public async Task<bool> UpdateStatusAsync(int id, MaintenanceStatus status)
        {
            var req = await _db.MaintenanceRequests.FindAsync(id);
            if (req == null) return false;

            req.Status = status;
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
