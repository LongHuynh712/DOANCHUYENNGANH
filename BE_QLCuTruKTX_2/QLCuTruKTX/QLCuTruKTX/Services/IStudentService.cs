using QLCuTruKTX.Models;

namespace QLCuTruKTX.Services
{
    public interface IStudentService
    {
        Task<Student?> GetByIdAsync(int id);
        Task<List<Student>> GetAllAsync();
    }
}
