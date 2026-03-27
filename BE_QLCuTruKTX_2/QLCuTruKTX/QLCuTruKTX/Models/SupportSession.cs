namespace QLCuTruKTX.Models;

public class SupportSession
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public string Status { get; set; } = "open";

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public ICollection<ChatMessage> Messages { get; set; }
        = new List<ChatMessage>();
}
