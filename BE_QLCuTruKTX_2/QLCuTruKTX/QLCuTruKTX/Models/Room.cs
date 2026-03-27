using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QLCuTruKTX.Models
{
    public class Room
    {
        public int Id { get; set; }

        [MaxLength(20)]
        public string RoomNumber { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public int CurrentOccupancy { get; set; }

        [MaxLength(20)]
        public string Status { get; set; } = "empty";

        public int BuildingId { get; set; }
        public Building? Building { get; set; }

        [JsonIgnore]
        public List<Tenancy> Tenancies { get; set; } = new();
    }
}
