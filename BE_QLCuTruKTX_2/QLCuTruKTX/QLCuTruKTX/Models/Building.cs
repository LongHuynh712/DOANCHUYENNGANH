using System.ComponentModel.DataAnnotations;

namespace QLCuTruKTX.Models
{
    public class Building
    {
        public int Id { get; set; }

        [MaxLength(20)]
        public string Code { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        // Mỗi Building có nhiều Rooms
        public List<Room> Rooms { get; set; } = new();
    }
}
