using QLCuTruKTX.Data;
using QLCuTruKTX.DTOs;
using QLCuTruKTX.Models;


namespace QLCuTruKTX.Services
{
    public class StatsService
    {
        private readonly ApplicationDbContext _context;

        public StatsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public DashboardStatsDto GetStats()
        {
            return new DashboardStatsDto
            {
                Students = _context.Students.Count(),
                Rooms = _context.Rooms.Count(),

                MaintenancePending = _context.MaintenanceRequests
                    .Count(m => m.Status == MaintenanceStatus.Pending),

                RoommatePending = _context.RoommateRequests
                    .Count(r => r.TrangThai == "pending"),

                FormsPending = _context.Forms
                    .Count(f => f.TrangThai == "pending")
            };
        }
    }
}
