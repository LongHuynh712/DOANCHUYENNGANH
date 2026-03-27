namespace QLCuTruKTX.DTOs
{
    public class TenancyDto
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int RoomId { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
