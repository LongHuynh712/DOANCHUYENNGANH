using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLCuTruKTX.Models
{
    public class Student
    {
        public int Id { get; set; }

        [Required]
        public string StudentId { get; set; } = null!;

        [Required]
        public string FullName { get; set; } = null!;

        public DateTime DateOfBirth { get; set; }

        public string Gender { get; set; } = null!;

        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;

        public string ClassName { get; set; } = null!;
        public string Faculty { get; set; } = null!;

        public string IdCard { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Status { get; set; } = "active";

        // ⭐ Quan trọng: navigation cho Tenancy
        public List<Tenancy> Tenancies { get; set; } = new();
    }
}
