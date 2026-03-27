using QLCuTruKTX.Models;

namespace QLCuTruKTX.Services
{
    public interface IMaintenanceService
    {
        Task<List<MaintenanceRequest>> GetAllAsync();
        Task<List<MaintenanceRequest>> GetByRoomAsync(int roomId);
        Task<MaintenanceRequest> CreateAsync(MaintenanceRequest req);
        Task<bool> UpdateStatusAsync(int id, MaintenanceStatus status);
    }
}
