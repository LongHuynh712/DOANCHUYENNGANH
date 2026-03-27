using System.ComponentModel.DataAnnotations;

namespace QLCuTruKTX.Models
{
    public class News
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Content { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}