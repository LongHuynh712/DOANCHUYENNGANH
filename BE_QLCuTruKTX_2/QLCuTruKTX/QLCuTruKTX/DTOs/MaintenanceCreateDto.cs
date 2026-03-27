namespace QLCuTruKTX.DTOs
{
	public class MaintenanceCreateDto
	{
		public int RoomId { get; set; }
		public int? SinhVienId { get; set; }
		public string Title { get; set; } = "";
		public string Description { get; set; } = "";
	}
}
