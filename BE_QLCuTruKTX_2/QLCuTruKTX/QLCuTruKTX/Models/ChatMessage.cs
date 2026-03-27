using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLCuTruKTX.Models
{
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }

        public int SenderId { get; set; }
        [ForeignKey("SenderId")]
        public User? Sender { get; set; }

        public int? ReceiverId { get; set; } // Nếu null là chat chung
        [ForeignKey("ReceiverId")]
        public User? Receiver { get; set; }

        public string Message { get; set; } = "";
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public bool IsRead { get; set; } = false;
    }
}